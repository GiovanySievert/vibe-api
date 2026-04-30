import { AppNotificationsInsert, AppNotificationsSelect } from '../../application/schemas'

export interface ListAppNotificationsInput {
  userId: string
  limit: number
  cursor?: string
  unreadOnly?: boolean
}

export interface ListAppNotificationsResult {
  items: AppNotificationsSelect[]
  nextCursor: string | null
}

export interface AppNotificationRepository {
  createMany(rows: AppNotificationsInsert[]): Promise<void>
  list(input: ListAppNotificationsInput): Promise<ListAppNotificationsResult>
  countUnread(userId: string): Promise<number>
  markAsRead(userId: string, notificationId: string): Promise<AppNotificationsSelect | null>
  markAllAsRead(userId: string): Promise<number>
}
