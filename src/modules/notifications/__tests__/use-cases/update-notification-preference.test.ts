import { beforeEach, describe, expect, it } from 'bun:test'

import { NotificationType } from '../../application/notification-types'
import { UpdateNotificationPreference } from '../../application/use-cases/update-notification-preference'
import { MockNotificationPreferencesRepository } from '../mocks/notification-preferences.repository.mock'

describe('UpdateNotificationPreference', () => {
  let repository: MockNotificationPreferencesRepository
  let useCase: UpdateNotificationPreference

  beforeEach(() => {
    repository = new MockNotificationPreferencesRepository()
    useCase = new UpdateNotificationPreference(repository)
  })

  it('upserts the preference for a valid notification type', async () => {
    const result = await useCase.execute({
      userId: 'user-1',
      type: 'event_invitation',
      pushEnabled: false,
      inAppEnabled: true
    })

    expect(result.userId).toBe('user-1')
    expect(result.type).toBe('event_invitation')
    expect(result.pushEnabled).toBe(false)
    expect(result.inAppEnabled).toBe(true)
    expect(repository.upsertCalls).toHaveLength(1)
  })

  it('overrides previously stored values when called again for the same type', async () => {
    await useCase.execute({ userId: 'user-1', type: 'event_invitation', pushEnabled: false })
    await useCase.execute({ userId: 'user-1', type: 'event_invitation', pushEnabled: true })

    const stored = await repository.findAllByUserId('user-1')
    const row = stored.find((item) => item.type === 'event_invitation')
    expect(row?.pushEnabled).toBe(true)
  })

  it('throws when the notification type is unknown', async () => {
    await expect(
      useCase.execute({
        userId: 'user-1',
        type: 'not_a_real_type' as NotificationType,
        pushEnabled: true
      })
    ).rejects.toThrow('Unknown notification type: not_a_real_type')
    expect(repository.upsertCalls).toHaveLength(0)
  })
})
