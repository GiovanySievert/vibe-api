import { beforeEach, describe, expect, it } from 'bun:test'

import { ListNotifications } from '../../application/use-cases/list-notifications'
import { MockAppNotificationRepository } from '../mocks/app-notification.repository.mock'

describe('ListNotifications', () => {
  let repository: MockAppNotificationRepository
  let useCase: ListNotifications

  beforeEach(() => {
    repository = new MockAppNotificationRepository()
    useCase = new ListNotifications(repository)
  })

  it('returns notifications and forwards filters to the repository', async () => {
    await repository.createMany([
      { userId: 'user-1', type: 'event_invitation', title: 't1', body: 'b1' },
      { userId: 'user-1', type: 'event_invitation', title: 't2', body: 'b2', readAt: new Date() }
    ])

    const result = await useCase.execute({ userId: 'user-1', unreadOnly: true })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].title).toBe('t1')
    expect(repository.listCalls[0]).toEqual({
      userId: 'user-1',
      limit: 20,
      cursor: undefined,
      unreadOnly: true
    })
  })

  it('uses a default limit of 20 when none is provided', async () => {
    await useCase.execute({ userId: 'user-1' })

    expect(repository.listCalls[0].limit).toBe(20)
  })

  it('clamps the limit between 1 and 50', async () => {
    await useCase.execute({ userId: 'user-1', limit: 999 })
    await useCase.execute({ userId: 'user-1', limit: 0 })
    await useCase.execute({ userId: 'user-1', limit: -5 })

    expect(repository.listCalls[0].limit).toBe(50)
    expect(repository.listCalls[1].limit).toBe(1)
    expect(repository.listCalls[2].limit).toBe(1)
  })

  it('returns an empty list when the user has no notifications', async () => {
    const result = await useCase.execute({ userId: 'user-without-data' })

    expect(result.items).toEqual([])
    expect(result.nextCursor).toBeNull()
  })
})
