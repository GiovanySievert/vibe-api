import { randomUUID } from 'crypto'

import { AppNotificationsInsert, AppNotificationsSelect } from '../../application/schemas'
import {
  AppNotificationRepository,
  ListAppNotificationsInput,
  ListAppNotificationsResult
} from '../../domain/repositories/app-notification.repository'

export class MockAppNotificationRepository implements AppNotificationRepository {
  public rows: AppNotificationsSelect[] = []
  public createManyCalls: AppNotificationsInsert[][] = []
  public listCalls: ListAppNotificationsInput[] = []

  async createMany(rows: AppNotificationsInsert[]): Promise<void> {
    this.createManyCalls.push(rows)
    for (const row of rows) {
      this.rows.push({
        id: row.id ?? randomUUID(),
        userId: row.userId,
        type: row.type,
        title: row.title,
        body: row.body,
        data: (row.data as Record<string, unknown>) ?? {},
        readAt: row.readAt ?? null,
        createdAt: row.createdAt ?? new Date()
      })
    }
  }

  async list(input: ListAppNotificationsInput): Promise<ListAppNotificationsResult> {
    this.listCalls.push(input)
    let items = this.rows.filter((row) => row.userId === input.userId)
    if (input.unreadOnly) {
      items = items.filter((row) => row.readAt === null)
    }
    items = items.slice(0, input.limit)
    return { items, nextCursor: null }
  }

  async countUnread(userId: string): Promise<number> {
    return this.rows.filter((row) => row.userId === userId && row.readAt === null).length
  }

  async markAsRead(
    userId: string,
    notificationId: string
  ): Promise<AppNotificationsSelect | null> {
    const row = this.rows.find((item) => item.id === notificationId && item.userId === userId)
    if (!row) return null
    if (row.readAt === null) {
      row.readAt = new Date()
    }
    return row
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0
    for (const row of this.rows) {
      if (row.userId === userId && row.readAt === null) {
        row.readAt = new Date()
        count++
      }
    }
    return count
  }
}
