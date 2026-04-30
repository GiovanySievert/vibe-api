import { AppNotificationRepository } from '../../domain/repositories/app-notification.repository'

interface ListNotificationsInput {
  userId: string
  limit?: number
  cursor?: string
  unreadOnly?: boolean
}

export class ListNotifications {
  constructor(private readonly repository: AppNotificationRepository) {}

  async execute(input: ListNotificationsInput) {
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 50)
    return await this.repository.list({
      userId: input.userId,
      limit,
      cursor: input.cursor,
      unreadOnly: input.unreadOnly
    })
  }
}
