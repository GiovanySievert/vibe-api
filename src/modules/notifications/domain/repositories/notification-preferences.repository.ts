import { NotificationType } from '../../application/notification-types'
import { NotificationPreferencesSelect } from '../../application/schemas'

export interface ChannelPreferences {
  pushEnabled: boolean
  inAppEnabled: boolean
}

export interface NotificationPreferencesRepository {
  findByUserIdsAndType(
    userIds: string[],
    type: NotificationType
  ): Promise<Map<string, ChannelPreferences>>
  findAllByUserId(userId: string): Promise<NotificationPreferencesSelect[]>
  upsert(input: {
    userId: string
    type: NotificationType
    pushEnabled?: boolean
    inAppEnabled?: boolean
  }): Promise<NotificationPreferencesSelect>
}
