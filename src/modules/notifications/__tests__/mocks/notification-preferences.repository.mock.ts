import { NotificationType } from '../../application/notification-types'
import { NotificationPreferencesSelect } from '../../application/schemas'
import {
  ChannelPreferences,
  NotificationPreferencesRepository
} from '../../domain/repositories/notification-preferences.repository'

export class MockNotificationPreferencesRepository implements NotificationPreferencesRepository {
  private store = new Map<string, ChannelPreferences>()

  set(userId: string, type: NotificationType, prefs: ChannelPreferences) {
    this.store.set(`${userId}:${type}`, prefs)
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

  async findAllByUserId(): Promise<NotificationPreferencesSelect[]> {
    return []
  }

  async upsert(): Promise<NotificationPreferencesSelect> {
    throw new Error('not implemented in mock')
  }
}
