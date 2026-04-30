import { NOTIFICATION_TYPES, NotificationType } from '../notification-types'
import { NotificationPreferencesRepository } from '../../domain/repositories/notification-preferences.repository'

interface UpdateNotificationPreferenceInput {
  userId: string
  type: NotificationType
  pushEnabled?: boolean
  inAppEnabled?: boolean
}

export class UpdateNotificationPreference {
  constructor(private readonly repository: NotificationPreferencesRepository) {}

  async execute(input: UpdateNotificationPreferenceInput) {
    if (!NOTIFICATION_TYPES.includes(input.type)) {
      throw new Error(`Unknown notification type: ${input.type}`)
    }
    return await this.repository.upsert(input)
  }
}
