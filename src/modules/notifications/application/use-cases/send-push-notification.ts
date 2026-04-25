import { DevicePushTokenRepository } from '../../domain/repositories/device-push-token.repository'
import { PushSender } from '../ports/push-sender'

interface SendPushNotificationInput {
  userIds: string[]
  title: string
  body: string
  data?: Record<string, unknown>
}

export class SendPushNotification {
  constructor(
    private readonly devicePushTokenRepository: DevicePushTokenRepository,
    private readonly pushSender: PushSender
  ) {}

  async execute(input: SendPushNotificationInput) {
    const userIds = [...new Set(input.userIds.filter(Boolean))]

    if (userIds.length === 0) {
      return {
        attemptedCount: 0,
        deliveredCount: 0,
        invalidTokens: []
      }
    }

    const deviceTokens = await this.devicePushTokenRepository.findActiveByUserIds(userIds)

    if (deviceTokens.length === 0) {
      return {
        attemptedCount: 0,
        deliveredCount: 0,
        invalidTokens: []
      }
    }

    const uniqueTokens = [...new Set(deviceTokens.map((deviceToken) => deviceToken.token))]
    const results = await this.pushSender.send(
      uniqueTokens.map((token) => ({
        to: token,
        title: input.title,
        body: input.body,
        data: input.data,
        sound: 'default'
      }))
    )

    const invalidTokens = results
      .filter((result) => result.details?.error === 'DeviceNotRegistered')
      .map((result) => result.token)

    if (invalidTokens.length > 0) {
      await this.devicePushTokenRepository.deactivateManyByTokens(invalidTokens)
    }

    return {
      attemptedCount: uniqueTokens.length,
      deliveredCount: results.filter((result) => result.status === 'ok').length,
      invalidTokens
    }
  }
}
