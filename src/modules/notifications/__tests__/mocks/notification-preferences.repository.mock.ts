import { NotificationType } from '../../application/notification-types'
import { NotificationPreferencesSelect } from '../../application/schemas'
import {
  ChannelPreferences,
  NotificationPreferencesRepository
} from '../../domain/repositories/notification-preferences.repository'

export class MockNotificationPreferencesRepository implements NotificationPreferencesRepository {
  private store = new Map<string, ChannelPreferences>()
  public rowsByUserId = new Map<string, NotificationPreferencesSelect[]>()
  public upsertCalls: {
    userId: string
    type: NotificationType
    pushEnabled?: boolean
    inAppEnabled?: boolean
  }[] = []

  set(userId: string, type: NotificationType, prefs: ChannelPreferences) {
    this.store.set(`${userId}:${type}`, prefs)
  }

  setRows(userId: string, rows: NotificationPreferencesSelect[]) {
    this.rowsByUserId.set(userId, rows)
  }

  async findByUserIdsAndType(
    userIds: string[],
    type: NotificationType
  ): Promise<Map<string, ChannelPreferences>> {
    const result = new Map<string, ChannelPreferences>()
    for (const userId of userIds) {
      const prefs = this.store.get(`${userId}:${type}`)
      if (prefs) {
        result.set(userId, prefs)
      }
    }
    return result
  }

  async findAllByUserId(userId?: string): Promise<NotificationPreferencesSelect[]> {
    if (!userId) return []
    return this.rowsByUserId.get(userId) ?? []
  }

  async upsert(input: {
    userId: string
    type: NotificationType
    pushEnabled?: boolean
    inAppEnabled?: boolean
  }): Promise<NotificationPreferencesSelect> {
    this.upsertCalls.push(input)
    const row: NotificationPreferencesSelect = {
      userId: input.userId,
      type: input.type,
      pushEnabled: input.pushEnabled ?? true,
      inAppEnabled: input.inAppEnabled ?? true,
      updatedAt: new Date()
    }
    const existing = this.rowsByUserId.get(input.userId) ?? []
    const filtered = existing.filter((item) => item.type !== input.type)
    filtered.push(row)
    this.rowsByUserId.set(input.userId, filtered)
    return row
  }
}
