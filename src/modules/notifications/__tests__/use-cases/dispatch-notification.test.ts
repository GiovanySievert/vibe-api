import { beforeEach, describe, expect, it } from 'bun:test'

import { NotificationPayload } from '../../application/notification-types'
import { DispatchNotification } from '../../application/use-cases/dispatch-notification'
import { MockNotificationChannel } from '../mocks/notification-channel.mock'
import { MockNotificationPreferencesRepository } from '../mocks/notification-preferences.repository.mock'

const buildPayload = (
  overrides: Partial<NotificationPayload> = {}
): NotificationPayload => ({
  type: 'event_invitation',
  title: 'Novo convite',
  body: 'Voce foi convidado.',
  data: { url: 'myapp://events/share/abc' },
  ...overrides
})

describe('DispatchNotification', () => {
  let preferencesRepo: MockNotificationPreferencesRepository
  let inAppChannel: MockNotificationChannel
  let pushChannel: MockNotificationChannel
  let useCase: DispatchNotification

  beforeEach(() => {
    preferencesRepo = new MockNotificationPreferencesRepository()
    inAppChannel = new MockNotificationChannel('in_app')
    pushChannel = new MockNotificationChannel('push')
    useCase = new DispatchNotification(preferencesRepo, inAppChannel, pushChannel)
  })

  it('sends to both channels by default when no preferences exist', async () => {
    await useCase.execute({
      userIds: ['user-1', 'user-2'],
      payload: buildPayload()
    })

    expect(inAppChannel.calls).toHaveLength(1)
    expect(inAppChannel.calls[0].userIds).toEqual(['user-1', 'user-2'])
    expect(pushChannel.calls).toHaveLength(1)
    expect(pushChannel.calls[0].userIds).toEqual(['user-1', 'user-2'])
  })

  it('skips push for users that opted out, but still delivers in-app', async () => {
    preferencesRepo.set('user-1', 'event_invitation', {
      pushEnabled: false,
      inAppEnabled: true
    })

    await useCase.execute({
      userIds: ['user-1', 'user-2'],
      payload: buildPayload()
    })

    expect(inAppChannel.calls[0].userIds).toEqual(['user-1', 'user-2'])
    expect(pushChannel.calls[0].userIds).toEqual(['user-2'])
  })

  it('skips in-app for users that opted out', async () => {
    preferencesRepo.set('user-1', 'event_invitation', {
      pushEnabled: true,
      inAppEnabled: false
    })

    await useCase.execute({
      userIds: ['user-1', 'user-2'],
      payload: buildPayload()
    })

    expect(inAppChannel.calls[0].userIds).toEqual(['user-2'])
    expect(pushChannel.calls[0].userIds).toEqual(['user-1', 'user-2'])
  })

  it('does nothing when userIds is empty', async () => {
    await useCase.execute({ userIds: [], payload: buildPayload() })

    expect(inAppChannel.calls).toHaveLength(0)
    expect(pushChannel.calls).toHaveLength(0)
  })

  it('deduplicates userIds and ignores falsy values', async () => {
    await useCase.execute({
      userIds: ['user-1', 'user-1', '', 'user-2'],
      payload: buildPayload()
    })

    expect(inAppChannel.calls[0].userIds).toEqual(['user-1', 'user-2'])
    expect(pushChannel.calls[0].userIds).toEqual(['user-1', 'user-2'])
  })

  it('does not throw when push channel fails, in-app still delivers', async () => {
    pushChannel.shouldFail = true

    await useCase.execute({
      userIds: ['user-1'],
      payload: buildPayload()
    })

    expect(inAppChannel.calls).toHaveLength(1)
    expect(pushChannel.calls).toHaveLength(1)
  })

  it('does not throw when in-app channel fails, push still delivers', async () => {
    inAppChannel.shouldFail = true

    await useCase.execute({
      userIds: ['user-1'],
      payload: buildPayload()
    })

    expect(inAppChannel.calls).toHaveLength(1)
    expect(pushChannel.calls).toHaveLength(1)
  })

  it('routes preferences by notification type, not globally', async () => {
    preferencesRepo.set('user-1', 'event_invitation', {
      pushEnabled: false,
      inAppEnabled: true
    })

    await useCase.execute({
      userIds: ['user-1'],
      payload: buildPayload({ type: 'follow_request_created' })
    })

    expect(pushChannel.calls[0].userIds).toEqual(['user-1'])
    expect(inAppChannel.calls[0].userIds).toEqual(['user-1'])
  })
})
