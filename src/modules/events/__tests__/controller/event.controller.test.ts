import { beforeEach, describe, expect, it } from 'bun:test'
import { User } from 'better-auth/types'

import { EventController } from '../../infrastructure/http/controllers/event.controller'
import { Event } from '../../domain/mappers'
import { EventParticipantStatus } from '../../domain/types'

const makeUser = (id: string): User => ({ id, name: `user-${id}`, email: `${id}@example.com` }) as User

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 'event-1',
  ownerId: 'owner-1',
  name: 'Friday Drinks',
  date: '2026-02-14',
  time: '20:00',
  description: 'Casual hangout',
  imageUrl: 'https://img/test.png',
  place: {
    id: 'place-1',
    name: 'Bar Tropical',
    type: 'bar',
    neighborhood: 'Pinheiros'
  },
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-02T00:00:00Z'),
  participants: [
    {
      id: 'participant-1',
      userId: 'user-1',
      username: 'alice',
      avatar: 'https://img/alice.png',
      status: EventParticipantStatus.PENDING
    }
  ],
  ...overrides
})

interface UseCaseSpy<TInput, TOutput> {
  calls: TInput[]
  result: TOutput
}

const spy = <TInput, TOutput>(result: TOutput): UseCaseSpy<TInput, TOutput> & { execute: (input: TInput) => Promise<TOutput> } => {
  const obj: any = { calls: [] as TInput[], result }
  obj.execute = async (input: TInput) => {
    obj.calls.push(input)
    return obj.result
  }
  return obj
}

describe('EventController', () => {
  let createEvent: ReturnType<typeof spy<any, Event>>
  let listUserEvents: ReturnType<typeof spy<any, Event[]>>
  let listEventInvitations: ReturnType<typeof spy<any, Event[]>>
  let getEventById: any
  let respondToEventInvitation: ReturnType<typeof spy<any, Event>>
  let updateEventDetails: ReturnType<typeof spy<any, Event>>
  let deleteEvent: ReturnType<typeof spy<any, void>>
  let controller: EventController

  beforeEach(() => {
    createEvent = spy(makeEvent())
    listUserEvents = spy([makeEvent({ id: 'event-1' }), makeEvent({ id: 'event-2', name: 'Another' })])
    listEventInvitations = spy([makeEvent({ id: 'event-3', name: 'Invitation' })])
    getEventById = {
      calls: [] as Array<{ id: string; userId: string }>,
      result: makeEvent(),
      async execute(id: string, userId: string) {
        this.calls.push({ id, userId })
        return this.result
      }
    }
    respondToEventInvitation = spy(makeEvent())
    updateEventDetails = spy(makeEvent({ description: 'Updated' }))
    deleteEvent = spy(undefined as void)

    controller = new EventController(
      createEvent as never,
      listUserEvents as never,
      listEventInvitations as never,
      getEventById as never,
      respondToEventInvitation as never,
      updateEventDetails as never,
      deleteEvent as never
    )
  })

  it('forwards user identity and body fields to CreateEvent use-case', async () => {
    await controller.create({
      body: {
        name: 'Party',
        date: '2026-03-01',
        time: '22:00',
        description: 'desc',
        placeId: 'place-9',
        imageUrl: 'http://img',
        participantIds: ['u-1', 'u-2']
      },
      user: makeUser('owner-9')
    })

    expect(createEvent.calls).toHaveLength(1)
    expect(createEvent.calls[0]).toEqual({
      ownerId: 'owner-9',
      ownerName: 'user-owner-9',
      name: 'Party',
      date: '2026-03-01',
      time: '22:00',
      description: 'desc',
      placeId: 'place-9',
      imageUrl: 'http://img',
      participantIds: ['u-1', 'u-2']
    })
  })

  it('maps domain Event to GetEventDto on create', async () => {
    const result = await controller.create({
      body: { name: 'X', date: '2026-03-01', time: '22:00', participantIds: [] },
      user: makeUser('owner-1')
    })

    expect(result).toEqual({
      id: 'event-1',
      ownerId: 'owner-1',
      name: 'Friday Drinks',
      date: '2026-02-14',
      time: '20:00',
      description: 'Casual hangout',
      imageUrl: 'https://img/test.png',
      place: {
        id: 'place-1',
        name: 'Bar Tropical',
        type: 'bar',
        neighborhood: 'Pinheiros'
      },
      createdAt: new Date('2026-01-01T00:00:00Z'),
      participants: [
        {
          id: 'participant-1',
          userId: 'user-1',
          username: 'alice',
          avatar: 'https://img/alice.png',
          status: EventParticipantStatus.PENDING
        }
      ]
    })
  })

  it('omits updatedAt and unwraps nested place via mapper', async () => {
    const result = await controller.create({
      body: { name: 'X', date: '2026-03-01', time: '22:00', participantIds: [] },
      user: makeUser('owner-1')
    })

    expect('updatedAt' in result).toBe(false)
  })

  it('maps null place to null in the dto', async () => {
    createEvent.result = makeEvent({ place: null })

    const result = await controller.create({
      body: { name: 'X', date: '2026-03-01', time: '22:00', participantIds: [] },
      user: makeUser('owner-1')
    })

    expect(result.place).toBeNull()
  })

  it('returns array via fromArray on list', async () => {
    const result = await controller.list({ user: makeUser('u-1') })
    expect(listUserEvents.calls).toEqual(['u-1'])
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('event-1')
    expect(result[1].id).toBe('event-2')
  })

  it('returns empty array when no events', async () => {
    listUserEvents.result = []
    const result = await controller.list({ user: makeUser('u-1') })
    expect(result).toEqual([])
  })

  it('returns mapped invitations array', async () => {
    const result = await controller.listInvitations({ user: makeUser('u-2') })
    expect(listEventInvitations.calls).toEqual(['u-2'])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Invitation')
  })

  it('forwards id and user.id to getEventById', async () => {
    const result = await controller.getById({ params: { id: 'event-1' }, user: makeUser('u-2') })
    expect(getEventById.calls).toEqual([{ id: 'event-1', userId: 'u-2' }])
    expect(result.id).toBe('event-1')
  })

  it('maps update response through GetEventDtoMapper', async () => {
    const result = await controller.updateDetails({
      params: { id: 'event-1' },
      body: { description: 'Updated', placeId: 'place-7', imageUrl: null },
      user: makeUser('owner-1')
    })

    expect(updateEventDetails.calls[0]).toEqual({
      eventId: 'event-1',
      userId: 'owner-1',
      description: 'Updated',
      placeId: 'place-7',
      imageUrl: null
    })
    expect(result.description).toBe('Updated')
  })

  it('maps invitation response through GetEventDtoMapper', async () => {
    const result = await controller.respondToInvitation({
      params: { id: 'event-1' },
      body: { status: 'accepted' },
      user: makeUser('u-1')
    })

    expect(respondToEventInvitation.calls[0]).toEqual({
      eventId: 'event-1',
      userId: 'u-1',
      status: 'accepted'
    })
    expect(result.id).toBe('event-1')
  })

  it('returns undefined on delete', async () => {
    const result = await controller.delete({ params: { id: 'event-1' }, user: makeUser('owner-1') })
    expect(deleteEvent.calls[0]).toEqual({ eventId: 'event-1', userId: 'owner-1' })
    expect(result).toBeUndefined()
  })
})
