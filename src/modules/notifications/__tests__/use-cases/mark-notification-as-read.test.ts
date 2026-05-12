import { beforeEach, describe, expect, it } from 'bun:test'

import { MarkNotificationAsRead } from '../../application/use-cases/mark-notification-as-read'
import { MockAppNotificationRepository } from '../mocks/app-notification.repository.mock'

describe('MarkNotificationAsRead', () => {
  let repository: MockAppNotificationRepository
  let useCase: MarkNotificationAsRead

  beforeEach(() => {
    repository = new MockAppNotificationRepository()
    useCase = new MarkNotificationAsRead(repository)
  })

  it('marks the notification as read when it belongs to the user', async () => {
    await repository.createMany([
      { id: 'notif-1', userId: 'user-1', type: 'event_invitation', title: 't', body: 'b' }
    ])

    const result = await useCase.execute('user-1', 'notif-1')

    expect(result.ok).toBe(true)
    expect(result.notification).not.toBeNull()
    expect(result.notification?.readAt).toBeInstanceOf(Date)
  })

  it('returns ok false when the notification id does not exist', async () => {
    const result = await useCase.execute('user-1', 'missing-id')

    expect(result).toEqual({ ok: false, notification: null })
  })

  it('returns ok false when the notification belongs to a different user', async () => {
    await repository.createMany([
      { id: 'notif-1', userId: 'user-2', type: 'event_invitation', title: 't', body: 'b' }
    ])

    const result = await useCase.execute('user-1', 'notif-1')

    expect(result.ok).toBe(false)
    expect(result.notification).toBeNull()
    expect(await repository.countUnread('user-2')).toBe(1)
  })
})
