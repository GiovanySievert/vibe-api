import { NOTIFICATION_TYPES, NotificationType } from '../notification-types'
import { NotificationPreferencesRepository } from '../../domain/repositories/notification-preferences.repository'

export interface NotificationPreferenceView {
  type: NotificationType
  pushEnabled: boolean
  inAppEnabled: boolean
}

export class GetNotificationPreferences {
  constructor(private readonly repository: NotificationPreferencesRepository) {}

  async execute(userId: string): Promise<NotificationPreferenceView[]> {
    const stored = await this.repository.findAllByUserId(userId)
    const byType = new Map(stored.map((row) => [row.type, row]))

    return NOTIFICATION_TYPES.map((type) => {
      const row = byType.get(type)
      return {
        type,
        pushEnabled: row?.pushEnabled ?? true,
        inAppEnabled: row?.inAppEnabled ?? true
      }
    })
  }
}
