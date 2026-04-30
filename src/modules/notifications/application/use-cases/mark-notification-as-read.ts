import { AppNotificationRepository } from '../../domain/repositories/app-notification.repository'

export class MarkNotificationAsRead {
  constructor(private readonly repository: AppNotificationRepository) {}

  async execute(userId: string, notificationId: string) {
    const updated = await this.repository.markAsRead(userId, notificationId)
    return { ok: updated !== null, notification: updated }
  }
}
