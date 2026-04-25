import { DevicePushTokenRepository } from '../../domain/repositories/device-push-token.repository'

export class UnregisterDevicePushToken {
  constructor(private readonly devicePushTokenRepository: DevicePushTokenRepository) {}

  async execute(userId: string, token: string) {
    await this.devicePushTokenRepository.deactivateByToken(token, userId)
  }
}
