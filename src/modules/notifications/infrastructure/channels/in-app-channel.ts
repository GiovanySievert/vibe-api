import { NotificationChannel } from '../../application/ports/notification-channel'
import { NotificationPayload } from '../../application/notification-types'
import { AppNotificationRepository } from '../../domain/repositories/app-notification.repository'

export class InAppChannel implements NotificationChannel {
  readonly name = 'in_app' as const

  constructor(private readonly appNotificationRepository: AppNotificationRepository) {}

  async send(userIds: string[], payload: NotificationPayload): Promise<void> {
    if (userIds.length === 0) {
      return
    }

    const rows = userIds.map((userId) => ({
      userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: payload.data
    }))

    await this.appNotificationRepository.createMany(rows)
  }
}
