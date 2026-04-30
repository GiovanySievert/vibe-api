import { appLogger } from '@src/config/logger'
import { NotificationChannel } from '../ports/notification-channel'
import { NotificationPayload } from '../notification-types'
import { NotificationPreferencesRepository } from '../../domain/repositories/notification-preferences.repository'

interface DispatchNotificationInput {
  userIds: string[]
  payload: NotificationPayload
}

export class DispatchNotification {
  constructor(
    private readonly preferencesRepository: NotificationPreferencesRepository,
    private readonly inAppChannel: NotificationChannel,
    private readonly pushChannel: NotificationChannel
  ) {}

  async execute({ userIds, payload }: DispatchNotificationInput): Promise<void> {
    const uniqueUserIds = [...new Set(userIds.filter(Boolean))]

    if (uniqueUserIds.length === 0) {
      return
    }

    const preferences = await this.preferencesRepository.findByUserIdsAndType(
      uniqueUserIds,
      payload.type
    )

    const inAppRecipients: string[] = []
    const pushRecipients: string[] = []

    for (const userId of uniqueUserIds) {
      const pref = preferences.get(userId)
      if (pref?.inAppEnabled !== false) {
        inAppRecipients.push(userId)
      }
      if (pref?.pushEnabled !== false) {
        pushRecipients.push(userId)
      }
    }

    const results = await Promise.allSettled([
      this.inAppChannel.send(inAppRecipients, payload),
      this.pushChannel.send(pushRecipients, payload)
    ])

    results.forEach((result, idx) => {
      if (result.status === 'rejected') {
        const channelName = idx === 0 ? this.inAppChannel.name : this.pushChannel.name
        appLogger.warn('notification channel failed', {
          channel: channelName,
          type: payload.type,
          error: result.reason
        })
      }
    })
  }
}
