import { AppNotificationRepository } from '../../domain/repositories/app-notification.repository'

export class MarkAllNotificationsAsRead {
  constructor(private readonly repository: AppNotificationRepository) {}

  async execute(userId: string): Promise<{ updated: number }> {
    const updated = await this.repository.markAllAsRead(userId)
    return { updated }
  }
}
