import { beforeEach, describe, expect, it } from 'bun:test'

import { SendPushNotification } from '../../application/use-cases/send-push-notification'
import { MockDevicePushTokenRepository } from '../mocks/device-push-token.repository.mock'
import { MockPushSender } from '../mocks/push-sender.mock'

const seedToken = async (
  repository: MockDevicePushTokenRepository,
  userId: string,
  token: string
) => {
  await repository.upsert({
    userId,
    token,
    platform: 'ios',
    permissionStatus: 'granted'
  })
}

describe('SendPushNotification', () => {
  let repository: MockDevicePushTokenRepository
  let pushSender: MockPushSender
  let useCase: SendPushNotification

  beforeEach(() => {
    repository = new MockDevicePushTokenRepository()
    pushSender = new MockPushSender()
    useCase = new SendPushNotification(repository, pushSender)
  })

  it('sends a push notification to every active token of the target users', async () => {
    await seedToken(repository, 'user-1', 'token-1')
    await seedToken(repository, 'user-2', 'token-2')

    const result = await useCase.execute({
      userIds: ['user-1', 'user-2'],
      title: 'Hello',
      body: 'World',
      data: { url: 'myapp://x' }
    })

    expect(result).toEqual({ attemptedCount: 2, deliveredCount: 2, invalidTokens: [] })
    expect(pushSender.calls).toHaveLength(1)
    expect(pushSender.calls[0].map((message) => message.to).sort()).toEqual(['token-1', 'token-2'])
    expect(pushSender.calls[0][0]).toMatchObject({
      title: 'Hello',
      body: 'World',
      data: { url: 'myapp://x' },
      sound: 'default'
    })
  })

  it('returns zero counts and does not call the sender when there are no userIds', async () => {
    const result = await useCase.execute({ userIds: [], title: 't', body: 'b' })

    expect(result).toEqual({ attemptedCount: 0, deliveredCount: 0, invalidTokens: [] })
    expect(pushSender.calls).toHaveLength(0)
  })

  it('returns zero counts when the users have no active device tokens', async () => {
    const result = await useCase.execute({
      userIds: ['user-without-tokens'],
      title: 't',
      body: 'b'
    })

    expect(result).toEqual({ attemptedCount: 0, deliveredCount: 0, invalidTokens: [] })
    expect(pushSender.calls).toHaveLength(0)
  })

  it('deactivates invalid tokens returned by the sender', async () => {
    await seedToken(repository, 'user-1', 'token-good')
    await seedToken(repository, 'user-1', 'token-bad')
    pushSender.resultsByToken.set('token-bad', {
      token: 'token-bad',
      status: 'error',
      details: { error: 'DeviceNotRegistered' }
    })

    const result = await useCase.execute({
      userIds: ['user-1'],
      title: 't',
      body: 'b'
    })

    expect(result.attemptedCount).toBe(2)
    expect(result.deliveredCount).toBe(1)
    expect(result.invalidTokens).toEqual(['token-bad'])
    expect(repository.deactivateManyByTokensCalls).toEqual([['token-bad']])
    const bad = repository.rows.find((row) => row.token === 'token-bad')
    expect(bad?.isActive).toBe(false)
  })

  it('deduplicates userIds and ignores falsy values', async () => {
    await seedToken(repository, 'user-1', 'token-1')

    await useCase.execute({
      userIds: ['user-1', 'user-1', '', 'user-1'],
      title: 't',
      body: 'b'
    })

    expect(pushSender.calls[0]).toHaveLength(1)
    expect(pushSender.calls[0][0].to).toBe('token-1')
  })
})
