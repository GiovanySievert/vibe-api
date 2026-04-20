import { describe, it, expect, beforeEach } from 'bun:test'

import { ListUserEvents } from '../../application/use-cases/events'
import { MockEventRepository } from '../mocks/event.repository.mock'

describe('ListUserEvents', () => {
  let listUserEvents: ListUserEvents
  let mockEventRepo: MockEventRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    listUserEvents = new ListUserEvents(mockEventRepo)
  })

  it('should return empty array when user has no events', async () => {
    const result = await listUserEvents.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should list all events for the owner', async () => {
    await mockEventRepo.create({ ownerId: 'user-1', name: 'Evento 1', date: '01/01/2026', time: '10:00', participantIds: [] })
    await mockEventRepo.create({ ownerId: 'user-1', name: 'Evento 2', date: '02/01/2026', time: '12:00', participantIds: [] })

    const result = await listUserEvents.execute('user-1')

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Evento 1')
    expect(result[1].name).toBe('Evento 2')
  })

  it('should only return events belonging to the requesting user', async () => {
    await mockEventRepo.create({ ownerId: 'user-1', name: 'Meu Evento', date: '01/01/2026', time: '10:00', participantIds: [] })
    await mockEventRepo.create({ ownerId: 'user-2', name: 'Evento de Outro', date: '02/01/2026', time: '12:00', participantIds: [] })

    const result = await listUserEvents.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Meu Evento')
    expect(result[0].ownerId).toBe('user-1')
  })
})
