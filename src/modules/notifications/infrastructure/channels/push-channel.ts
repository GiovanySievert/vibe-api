import { NotificationChannel } from '../../application/ports/notification-channel'
import { NotificationPayload } from '../../application/notification-types'
import { SendPushNotification } from '../../application/use-cases/send-push-notification'

export class PushChannel implements NotificationChannel {
  readonly name = 'push' as const

  constructor(private readonly sendPushNotification: SendPushNotification) {}

  async send(userIds: string[], payload: NotificationPayload): Promise<void> {
    if (userIds.length === 0) {
      return
    }

    await this.sendPushNotification.execute({
      userIds,
      title: payload.title,
      body: payload.body,
      data: payload.data
    })
  }
}
