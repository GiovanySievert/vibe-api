import { beforeEach, describe, expect, it } from 'bun:test'

import { RespondToEventInvitation } from '../../application/use-cases/events'
import {
  EventInvitationAlreadyRespondedException,
  EventNotFoundException,
  EventParticipantNotFoundException
} from '../../domain/exceptions'
import { EventParticipantStatus } from '../../domain/types'
import { MockEventRepository } from '../mocks/event.repository.mock'

describe('RespondToEventInvitation', () => {
  let respondToEventInvitation: RespondToEventInvitation
  let mockEventRepo: MockEventRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    respondToEventInvitation = new RespondToEventInvitation(mockEventRepo)
  })

  it('should accept a pending invitation', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: ['user-2']
    })

    const result = await respondToEventInvitation.execute({
      eventId: created.id,
      userId: 'user-2',
      status: EventParticipantStatus.ACCEPTED
    })

    expect(result.participants?.[0].status).toBe(EventParticipantStatus.ACCEPTED)
  })

  it('should decline a pending invitation', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: ['user-2']
    })

    const result = await respondToEventInvitation.execute({
      eventId: created.id,
      userId: 'user-2',
      status: EventParticipantStatus.DECLINED
    })

    expect(result.participants?.[0].status).toBe(EventParticipantStatus.DECLINED)
  })

  it('should throw for an unknown token', async () => {
    expect(async () => {
      await respondToEventInvitation.execute({
        eventId: 'id-inexistente',
        userId: 'user-2',
        status: EventParticipantStatus.ACCEPTED
      })
    }).toThrow(EventNotFoundException)
  })

  it('should throw when the user is not a participant', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: ['user-2']
    })

    expect(async () => {
      await respondToEventInvitation.execute({
        eventId: created.id,
        userId: 'user-3',
        status: EventParticipantStatus.ACCEPTED
      })
    }).toThrow(EventParticipantNotFoundException)
  })

  it('should throw when the invitation was already responded to', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: ['user-2']
    })

    await respondToEventInvitation.execute({
      eventId: created.id,
      userId: 'user-2',
      status: EventParticipantStatus.ACCEPTED
    })

    expect(async () => {
      await respondToEventInvitation.execute({
        eventId: created.id,
        userId: 'user-2',
        status: EventParticipantStatus.DECLINED
      })
    }).toThrow(EventInvitationAlreadyRespondedException)
  })
})
