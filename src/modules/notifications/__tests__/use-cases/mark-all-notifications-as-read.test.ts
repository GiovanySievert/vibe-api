import { beforeEach, describe, expect, it } from 'bun:test'

import { MarkAllNotificationsAsRead } from '../../application/use-cases/mark-all-notifications-as-read'
import { MockAppNotificationRepository } from '../mocks/app-notification.repository.mock'

describe('MarkAllNotificationsAsRead', () => {
  let repository: MockAppNotificationRepository
  let useCase: MarkAllNotificationsAsRead

  beforeEach(() => {
    repository = new MockAppNotificationRepository()
    useCase = new MarkAllNotificationsAsRead(repository)
  })

  it('marks every unread notification of the user as read and returns the count', async () => {
    await repository.createMany([
      { userId: 'user-1', type: 'event_invitation', title: 't1', body: 'b1' },
      { userId: 'user-1', type: 'event_invitation', title: 't2', body: 'b2' },
      { userId: 'user-1', type: 'event_invitation', title: 't3', body: 'b3', readAt: new Date() }
    ])

    const result = await useCase.execute('user-1')

    expect(result).toEqual({ updated: 2 })
    expect(await repository.countUnread('user-1')).toBe(0)
  })

  it('returns updated zero when the user has no unread notifications', async () => {
    const result = await useCase.execute('user-without-data')

    expect(result).toEqual({ updated: 0 })
  })

  it('does not touch notifications belonging to other users', async () => {
    await repository.createMany([
      { userId: 'user-1', type: 'event_invitation', title: 't1', body: 'b1' },
      { userId: 'user-2', type: 'event_invitation', title: 't2', body: 'b2' }
    ])

    const result = await useCase.execute('user-1')

    expect(result).toEqual({ updated: 1 })
    expect(await repository.countUnread('user-2')).toBe(1)
  })
})
