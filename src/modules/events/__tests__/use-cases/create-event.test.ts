import { describe, it, expect, beforeEach } from 'bun:test'

import { CreateEvent } from '../../application/use-cases/events'
import { EventParticipantStatus } from '../../domain/types'
import { MockEventRepository } from '../mocks/event.repository.mock'

describe('CreateEvent', () => {
  let createEvent: CreateEvent
  let mockEventRepo: MockEventRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    createEvent = new CreateEvent(mockEventRepo)
  })

  it('should create an event successfully', async () => {
    const input = {
      ownerId: 'user-1',
      name: 'Meu Aniversário',
      date: '25/12/2025',
      time: '18:00',
      description: 'Festa de aniversário',
      participantIds: ['user-2', 'user-3']
    }

    const result = await createEvent.execute(input)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.name).toBe(input.name)
    expect(result.date).toBe(input.date)
    expect(result.time).toBe(input.time)
    expect(result.description).toBe(input.description)
    expect(result.ownerId).toBe(input.ownerId)

  })

  it('should create an event with participants', async () => {
    const input = {
      ownerId: 'user-1',
      name: 'Churrasco',
      date: '01/01/2026',
      time: '12:00',
      participantIds: ['user-2', 'user-3']
    }

    const result = await createEvent.execute(input)

    expect(result.participants).toHaveLength(2)
    expect(result.participants![0].userId).toBe('user-2')
    expect(result.participants![1].userId).toBe('user-3')
    expect(result.participants![0].status).toBe(EventParticipantStatus.PENDING)
  })

  it('should create an event with no participants', async () => {
    const input = {
      ownerId: 'user-1',
      name: 'Evento Solo',
      date: '15/06/2025',
      time: '20:00',
      participantIds: []
    }

    const result = await createEvent.execute(input)

    expect(result.participants).toHaveLength(0)
  })

  it('should create an event without description', async () => {
    const input = {
      ownerId: 'user-1',
      name: 'Rolê',
      date: '10/10/2025',
      time: '22:00',
      participantIds: []
    }

    const result = await createEvent.execute(input)

    expect(result.description).toBeNull()
  })
})
