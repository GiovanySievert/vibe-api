import { beforeEach, describe, expect, it } from 'bun:test'

import { RegisterDevicePushToken } from '../../application/use-cases/register-device-push-token'
import { MockDevicePushTokenRepository } from '../mocks/device-push-token.repository.mock'

describe('RegisterDevicePushToken', () => {
  let repository: MockDevicePushTokenRepository
  let useCase: RegisterDevicePushToken

  beforeEach(() => {
    repository = new MockDevicePushTokenRepository()
    useCase = new RegisterDevicePushToken(repository)
  })

  it('upserts a new device push token and returns the active row', async () => {
    const result = await useCase.execute({
      userId: 'user-1',
      token: 'ExpoToken[abc]',
      platform: 'ios',
      permissionStatus: 'granted'
    })

    expect(result.token).toBe('ExpoToken[abc]')
    expect(result.userId).toBe('user-1')
    expect(result.isActive).toBe(true)
    expect(repository.rows).toHaveLength(1)
    expect(repository.upsertCalls).toHaveLength(1)
  })

  it('reactivates and updates an existing token instead of duplicating it', async () => {
    await useCase.execute({
      userId: 'user-1',
      token: 'ExpoToken[abc]',
      platform: 'ios',
      permissionStatus: 'granted'
    })
    repository.rows[0].isActive = false

    const result = await useCase.execute({
      userId: 'user-1',
      token: 'ExpoToken[abc]',
      platform: 'ios',
      appBuild: '2.1.0',
      permissionStatus: 'granted'
    })

    expect(repository.rows).toHaveLength(1)
    expect(result.isActive).toBe(true)
    expect(result.appBuild).toBe('2.1.0')
  })

  it('accepts optional deviceId and appBuild and forwards them to the repository', async () => {
    await useCase.execute({
      userId: 'user-1',
      token: 'ExpoToken[xyz]',
      platform: 'android',
      deviceId: 'device-42',
      appBuild: '1.0.0',
      permissionStatus: 'granted'
    })

    expect(repository.upsertCalls[0]).toEqual({
      userId: 'user-1',
      token: 'ExpoToken[xyz]',
      platform: 'android',
      deviceId: 'device-42',
      appBuild: '1.0.0',
      permissionStatus: 'granted'
    })
  })
})
