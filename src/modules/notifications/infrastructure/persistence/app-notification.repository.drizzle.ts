import { db } from '@src/infra/database/client'
import { and, desc, eq, isNull, lt, sql } from 'drizzle-orm'
import { appNotifications, AppNotificationsInsert, AppNotificationsSelect } from '../../application/schemas'
import {
  AppNotificationRepository,
  ListAppNotificationsInput,
  ListAppNotificationsResult
} from '../../domain/repositories/app-notification.repository'

export class DrizzleAppNotificationRepository implements AppNotificationRepository {
  async createMany(rows: AppNotificationsInsert[]): Promise<void> {
    if (rows.length === 0) {
      return
    }
    await db.insert(appNotifications).values(rows)
  }

  async list(input: ListAppNotificationsInput): Promise<ListAppNotificationsResult> {
    const conditions = [eq(appNotifications.userId, input.userId)]
    if (input.unreadOnly) {
      conditions.push(isNull(appNotifications.readAt))
    }
    if (input.cursor) {
      conditions.push(lt(appNotifications.createdAt, new Date(input.cursor)))
    }

    const rows = await db
      .select()
      .from(appNotifications)
      .where(and(...conditions))
      .orderBy(desc(appNotifications.createdAt))
      .limit(input.limit + 1)

    const hasMore = rows.length > input.limit
    const items = hasMore ? rows.slice(0, input.limit) : rows
    const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null

    return { items, nextCursor }
  }

  async countUnread(userId: string): Promise<number> {
    const [row] = await db
      .select({ count: sql<number>`LEAST(count(*)::int, 99)` })
      .from(appNotifications)
      .where(and(eq(appNotifications.userId, userId), isNull(appNotifications.readAt)))

    return row?.count ?? 0
  }

  async markAsRead(userId: string, notificationId: string): Promise<AppNotificationsSelect | null> {
    const [row] = await db
      .update(appNotifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(appNotifications.id, notificationId),
          eq(appNotifications.userId, userId),
          isNull(appNotifications.readAt)
        )
      )
      .returning()

    return row ?? null
  }

  async markAllAsRead(userId: string): Promise<number> {
    const rows = await db
      .update(appNotifications)
      .set({ readAt: new Date() })
      .where(and(eq(appNotifications.userId, userId), isNull(appNotifications.readAt)))
      .returning({ id: appNotifications.id })

    return rows.length
  }
}
