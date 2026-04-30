import { db } from '@src/infra/database/client'
import { and, eq, inArray } from 'drizzle-orm'
import { NotificationType } from '../../application/notification-types'
import { notificationPreferences, NotificationPreferencesSelect } from '../../application/schemas'
import {
  ChannelPreferences,
  NotificationPreferencesRepository
} from '../../domain/repositories/notification-preferences.repository'

export class DrizzleNotificationPreferencesRepository implements NotificationPreferencesRepository {
  async findByUserIdsAndType(
    userIds: string[],
    type: NotificationType
  ): Promise<Map<string, ChannelPreferences>> {
    const result = new Map<string, ChannelPreferences>()
    if (userIds.length === 0) {
      return result
    }

    const rows = await db
      .select()
      .from(notificationPreferences)
      .where(
        and(
          inArray(notificationPreferences.userId, userIds),
          eq(notificationPreferences.type, type)
        )
      )

    for (const row of rows) {
      result.set(row.userId, {
        pushEnabled: row.pushEnabled,
        inAppEnabled: row.inAppEnabled
      })
    }

    return result
  }

  async findAllByUserId(userId: string): Promise<NotificationPreferencesSelect[]> {
    return await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
  }

  async upsert(input: {
    userId: string
    type: NotificationType
    pushEnabled?: boolean
    inAppEnabled?: boolean
  }): Promise<NotificationPreferencesSelect> {
    const setClause: Record<string, unknown> = { updatedAt: new Date() }
    if (input.pushEnabled !== undefined) setClause.pushEnabled = input.pushEnabled
    if (input.inAppEnabled !== undefined) setClause.inAppEnabled = input.inAppEnabled

    const [row] = await db
      .insert(notificationPreferences)
      .values({
        userId: input.userId,
        type: input.type,
        pushEnabled: input.pushEnabled ?? true,
        inAppEnabled: input.inAppEnabled ?? true,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [notificationPreferences.userId, notificationPreferences.type],
        set: setClause
      })
      .returning()

    return row
  }
}
