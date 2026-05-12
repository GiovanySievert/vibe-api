import { beforeEach, describe, expect, it } from 'bun:test'

import { UnregisterDevicePushToken } from '../../application/use-cases/unregister-device-push-token'
import { MockDevicePushTokenRepository } from '../mocks/device-push-token.repository.mock'

describe('UnregisterDevicePushToken', () => {
  let repository: MockDevicePushTokenRepository
  let useCase: UnregisterDevicePushToken

  beforeEach(() => {
    repository = new MockDevicePushTokenRepository()
    useCase = new UnregisterDevicePushToken(repository)
  })

  it('deactivates the token owned by the user', async () => {
    await repository.upsert({
      userId: 'user-1',
      token: 'token-1',
      platform: 'ios',
      permissionStatus: 'granted'
    })

    await useCase.execute('user-1', 'token-1')

    expect(repository.deactivateByTokenCalls).toEqual([{ token: 'token-1', userId: 'user-1' }])
    expect(repository.rows[0].isActive).toBe(false)
  })

  it('does not deactivate a token that belongs to a different user', async () => {
    await repository.upsert({
      userId: 'user-1',
      token: 'token-1',
      platform: 'ios',
      permissionStatus: 'granted'
    })

    await useCase.execute('user-2', 'token-1')

    expect(repository.deactivateByTokenCalls).toEqual([{ token: 'token-1', userId: 'user-2' }])
    expect(repository.rows[0].isActive).toBe(true)
  })

  it('is a no-op when the token does not exist', async () => {
    await useCase.execute('user-1', 'missing-token')

    expect(repository.deactivateByTokenCalls).toEqual([
      { token: 'missing-token', userId: 'user-1' }
    ])
    expect(repository.rows).toHaveLength(0)
  })
})
