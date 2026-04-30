import { AppNotificationRepository } from '../../domain/repositories/app-notification.repository'

export class CountUnreadNotifications {
  constructor(private readonly repository: AppNotificationRepository) {}

  async execute(userId: string): Promise<{ count: number }> {
    const count = await this.repository.countUnread(userId)
    return { count }
  }
}
