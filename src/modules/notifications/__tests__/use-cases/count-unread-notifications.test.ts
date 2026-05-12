import { beforeEach, describe, expect, it } from 'bun:test'

import { CountUnreadNotifications } from '../../application/use-cases/count-unread-notifications'
import { MockAppNotificationRepository } from '../mocks/app-notification.repository.mock'

describe('CountUnreadNotifications', () => {
  let repository: MockAppNotificationRepository
  let useCase: CountUnreadNotifications

  beforeEach(() => {
    repository = new MockAppNotificationRepository()
    useCase = new CountUnreadNotifications(repository)
  })

  it('returns the count of unread notifications for the user', async () => {
    await repository.createMany([
      { userId: 'user-1', type: 'event_invitation', title: 't1', body: 'b1' },
      { userId: 'user-1', type: 'event_invitation', title: 't2', body: 'b2' },
      { userId: 'user-1', type: 'event_invitation', title: 't3', body: 'b3', readAt: new Date() }
    ])

    const result = await useCase.execute('user-1')

    expect(result).toEqual({ count: 2 })
  })

  it('returns zero when the user has no notifications', async () => {
    const result = await useCase.execute('user-without-data')

    expect(result).toEqual({ count: 0 })
  })

  it('does not count notifications from other users', async () => {
    await repository.createMany([
      { userId: 'user-1', type: 'event_invitation', title: 't1', body: 'b1' },
      { userId: 'user-2', type: 'event_invitation', title: 't2', body: 'b2' }
    ])

    const result = await useCase.execute('user-1')

    expect(result).toEqual({ count: 1 })
  })
})
