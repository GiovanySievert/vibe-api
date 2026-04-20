import { describe, it, expect, beforeEach } from 'bun:test'

import { GetEventById } from '../../application/use-cases/events'
import { EventNotFoundException } from '../../domain/exceptions'
import { MockEventRepository } from '../mocks/event.repository.mock'

describe('GetEventById', () => {
  let getEventById: GetEventById
  let mockEventRepo: MockEventRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    getEventById = new GetEventById(mockEventRepo)
  })

  it('should return the event for a valid id', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Churrasco',
      date: '01/01/2026',
      time: '12:00',
      participantIds: ['user-2']
    })

    const result = await getEventById.execute(created.id)

    expect(result).toBeDefined()
    expect(result.id).toBe(created.id)
    expect(result.name).toBe('Churrasco')
  })

  it('should include participants in the returned event', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '15/07/2025',
      time: '20:00',
      participantIds: ['user-2', 'user-3']
    })

    const result = await getEventById.execute(created.id)

    expect(result.participants).toHaveLength(2)
  })

  it('should throw EventNotFoundException for an unknown id', async () => {
    expect(async () => {
      await getEventById.execute('id-inexistente')
    }).toThrow(EventNotFoundException)
  })
})
