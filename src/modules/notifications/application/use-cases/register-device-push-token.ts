import { DevicePushTokenRepository, UpsertDevicePushTokenInput } from '../../domain/repositories/device-push-token.repository'

export class RegisterDevicePushToken {
  constructor(private readonly devicePushTokenRepository: DevicePushTokenRepository) {}

  async execute(input: UpsertDevicePushTokenInput) {
    return await this.devicePushTokenRepository.upsert(input)
  }
}
