import { describe, it, expect, beforeEach } from 'bun:test'

import { ListEventInvitations } from '../../application/use-cases/events'
import { MockEventRepository } from '../mocks/event.repository.mock'

describe('ListEventInvitations', () => {
  let listEventInvitations: ListEventInvitations
  let mockEventRepo: MockEventRepository

  beforeEach(() => {
    mockEventRepo = new MockEventRepository()
    listEventInvitations = new ListEventInvitations(mockEventRepo)
  })

  it('should return empty array when user has no invitations', async () => {
    const result = await listEventInvitations.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should return events where the user is a participant', async () => {
    await mockEventRepo.create({
      ownerId: 'user-2',
      name: 'Churrasco',
      date: '01/01/2026',
      time: '12:00',
      participantIds: ['user-1', 'user-3']
    })

    await mockEventRepo.create({
      ownerId: 'user-3',
      name: 'Aniversário',
      date: '15/06/2026',
      time: '20:00',
      participantIds: ['user-1']
    })

    const result = await listEventInvitations.execute('user-1')

    expect(result).toHaveLength(2)
    expect(result.map((e) => e.name)).toContain('Churrasco')
    expect(result.map((e) => e.name)).toContain('Aniversário')
  })

  it('should not return events owned by the user', async () => {
    await mockEventRepo.create({
      ownerId: 'user-1',
      name: 'Meu Evento',
      date: '01/01/2026',
      time: '10:00',
      participantIds: []
    })

    const result = await listEventInvitations.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should only return events the user was invited to', async () => {
    await mockEventRepo.create({
      ownerId: 'user-2',
      name: 'Evento de user-2',
      date: '01/01/2026',
      time: '10:00',
      participantIds: ['user-1']
    })

    await mockEventRepo.create({
      ownerId: 'user-3',
      name: 'Evento de user-3',
      date: '02/01/2026',
      time: '12:00',
      participantIds: ['user-4']
    })

    const result = await listEventInvitations.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Evento de user-2')
  })
})
