import { beforeEach, describe, expect, it } from 'bun:test'

import { DeleteEvent } from '../../application/use-cases/events'
import { EventNotFoundException, EventNotOwnerException } from '../../domain/exceptions'
import { MockEventRepository } from '../mocks/event.repository.mock'

describe('DeleteEvent', () => {
  let deleteEvent: DeleteEvent
  let mockEventRepo: MockEventRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    deleteEvent = new DeleteEvent(mockEventRepo)
  })

  it('should delete the event when the user is the owner', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: ['user-2']
    })

    await deleteEvent.execute({ eventId: created.id, userId: 'user-1' })

    const found = await mockEventRepo.findById(created.id)
    expect(found).toBeNull()
  })

  it('should throw when the event does not exist', async () => {
    expect(async () => {
      await deleteEvent.execute({ eventId: 'id-inexistente', userId: 'user-1' })
    }).toThrow(EventNotFoundException)
  })

  it('should throw when the user is not the owner', async () => {
    const created = await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Festa',
      date: '10/10/2026',
      time: '20:00',
      participantIds: ['user-2']
    })

    expect(async () => {
      await deleteEvent.execute({ eventId: created.id, userId: 'user-2' })
    }).toThrow(EventNotOwnerException)
  })
})
