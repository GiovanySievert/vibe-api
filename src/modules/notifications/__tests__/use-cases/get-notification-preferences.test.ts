import { beforeEach, describe, expect, it } from 'bun:test'

import { NOTIFICATION_TYPES } from '../../application/notification-types'
import { GetNotificationPreferences } from '../../application/use-cases/get-notification-preferences'
import { MockNotificationPreferencesRepository } from '../mocks/notification-preferences.repository.mock'

describe('GetNotificationPreferences', () => {
  let repository: MockNotificationPreferencesRepository
  let useCase: GetNotificationPreferences

  beforeEach(() => {
    repository = new MockNotificationPreferencesRepository()
    useCase = new GetNotificationPreferences(repository)
  })

  it('returns all notification types with stored overrides applied', async () => {
    repository.setRows('user-1', [
      {
        userId: 'user-1',
        type: 'event_invitation',
        pushEnabled: false,
        inAppEnabled: true,
        updatedAt: new Date()
      }
    ])

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(NOTIFICATION_TYPES.length)
    const eventInvitation = result.find((row) => row.type === 'event_invitation')
    expect(eventInvitation).toEqual({
      type: 'event_invitation',
      pushEnabled: false,
      inAppEnabled: true
    })
  })

  it('defaults missing types to push and in-app enabled', async () => {
    const result = await useCase.execute('user-without-prefs')

    expect(result).toHaveLength(NOTIFICATION_TYPES.length)
    for (const row of result) {
      expect(row.pushEnabled).toBe(true)
      expect(row.inAppEnabled).toBe(true)
    }
  })

  it('includes every notification type in the output exactly once', async () => {
    const result = await useCase.execute('user-1')

    const types = result.map((row) => row.type).sort()
    const expected = [...NOTIFICATION_TYPES].sort()
    expect(types).toEqual(expected)
  })
})
