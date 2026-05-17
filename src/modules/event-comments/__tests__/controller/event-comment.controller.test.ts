import { beforeEach, describe, expect, it } from 'bun:test'
import { User } from 'better-auth/types'

import { EventNotFoundException } from '@src/modules/events/domain/exceptions'
import { MockEventRepository } from '@src/modules/events/__tests__/mocks/event.repository.mock'
import { ApplicationEvent, ApplicationEventBus } from '@src/shared/application/events'
import { EVENT_COMMENT_CREATED_EVENT } from '../../application/events/event-comment-created.event'

import { EventCommentController } from '../../infrastructure/http/controllers/event-comment.controller'

const makeUser = (id: string): User => ({ id, name: `user-${id}`, email: `${id}@example.com` }) as User

describe('EventCommentController', () => {
  let eventRepository: MockEventRepository
  let createCalls: number
  let listCalls: number
  let deleteCalls: number
  let publishedEvents: ApplicationEvent[]
  let controller: EventCommentController

  beforeEach(() => {
    eventRepository = new MockEventRepository()
    createCalls = 0
    listCalls = 0
    deleteCalls = 0
    publishedEvents = []

    controller = new EventCommentController(
      eventRepository,
      {
        async execute(input: { eventId: string; userId: string; content: string }) {
          createCalls++
          return {
            id: 'comment-1',
            eventId: input.eventId,
            userId: input.userId,
            username: `user-${input.userId}`,
            avatar: null,
            content: input.content,
            createdAt: new Date()
          }
        }
      } as never,
      {
        async execute() {
          deleteCalls++
        }
      } as never,
      {
        async execute() {
          listCalls++
          return { data: [], total: 0, hasMore: false }
        }
      } as never,
      {
        async publish(event: ApplicationEvent) {
          publishedEvents.push(event)
        },
        subscribe() {}
      } as ApplicationEventBus
    )
  })

  it('allows an event participant to list comments', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    const result = await controller.list({
      params: { id: event.id },
      query: {},
      user: makeUser('user-1')
    })

    expect(result.total).toBe(0)
    expect(listCalls).toBe(1)
  })

  it('hides comments from authenticated users outside the event', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    await expect(
      controller.list({
        params: { id: event.id },
        query: {},
        user: makeUser('user-2')
      })
    ).rejects.toThrow(EventNotFoundException)
    expect(listCalls).toBe(0)
  })

  it('prevents users outside the event from creating comments', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    await expect(
      controller.create({
        params: { id: event.id },
        body: { content: 'hi' },
        user: makeUser('user-2')
      })
    ).rejects.toThrow(EventNotFoundException)
    expect(createCalls).toBe(0)
  })

  it('prevents users outside the event from deleting comments', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    await expect(
      controller.delete({
        params: { id: event.id, commentId: 'comment-1' },
        user: makeUser('user-2')
      })
    ).rejects.toThrow(EventNotFoundException)
    expect(deleteCalls).toBe(0)
  })

  it('publishes a comment-created event when commenter is not the event owner', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    const result = await controller.create({
      params: { id: event.id },
      body: { content: 'looking forward!' },
      user: makeUser('user-1')
    })

    expect(createCalls).toBe(1)
    expect(publishedEvents).toHaveLength(1)
    expect(publishedEvents[0].name).toBe(EVENT_COMMENT_CREATED_EVENT)
    expect(publishedEvents[0].payload).toEqual({
      commentId: 'comment-1',
      eventId: event.id,
      eventName: 'Dinner',
      eventOwnerId: 'owner-1',
      commenterId: 'user-1',
      commenterName: 'user-user-1'
    })
    expect(result.id).toBe('comment-1')
  })

  it('does NOT publish an event when the commenter is the event owner', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    await controller.create({
      params: { id: event.id },
      body: { content: 'my own event' },
      user: makeUser('owner-1')
    })

    expect(createCalls).toBe(1)
    expect(publishedEvents).toHaveLength(0)
  })

  it('returns a mapped comment dto from create', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    const result = await controller.create({
      params: { id: event.id },
      body: { content: 'hi' },
      user: makeUser('user-1')
    })

    expect(result).toMatchObject({
      id: 'comment-1',
      eventId: event.id,
      userId: 'user-1',
      content: 'hi'
    })
  })

  it('returns {success: true} on successful delete', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    const result = await controller.delete({
      params: { id: event.id, commentId: 'comment-1' },
      user: makeUser('user-1')
    })

    expect(result).toEqual({ success: true })
    expect(deleteCalls).toBe(1)
  })

  it('coerces non-numeric page query to 1 when listing', async () => {
    const event = await eventRepository.create({
      ownerId: 'owner-1',
      name: 'Dinner',
      date: '2026-01-01',
      time: '20:00',
      participantIds: ['user-1']
    })

    await controller.list({
      params: { id: event.id },
      query: { page: 'abc' },
      user: makeUser('owner-1')
    })

    expect(listCalls).toBe(1)
  })

  it('throws EventNotFoundException when event does not exist on create', async () => {
    await expect(
      controller.create({
        params: { id: 'missing-event' },
        body: { content: 'hi' },
        user: makeUser('user-1')
      })
    ).rejects.toThrow(EventNotFoundException)
    expect(createCalls).toBe(0)
    expect(publishedEvents).toHaveLength(0)
  })
})
