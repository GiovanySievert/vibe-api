import { User } from 'better-auth/types'
import { NotificationType } from '../../../application/notification-types'
import { CountUnreadNotifications } from '../../../application/use-cases/count-unread-notifications'
import { GetNotificationPreferences } from '../../../application/use-cases/get-notification-preferences'
import { ListNotifications } from '../../../application/use-cases/list-notifications'
import { MarkAllNotificationsAsRead } from '../../../application/use-cases/mark-all-notifications-as-read'
import { MarkNotificationAsRead } from '../../../application/use-cases/mark-notification-as-read'
import { UpdateNotificationPreference } from '../../../application/use-cases/update-notification-preference'

export class NotificationsController {
  constructor(
    private readonly listNotifications: ListNotifications,
    private readonly countUnreadNotifications: CountUnreadNotifications,
    private readonly markNotificationAsRead: MarkNotificationAsRead,
    private readonly markAllNotificationsAsRead: MarkAllNotificationsAsRead,
    private readonly getNotificationPreferences: GetNotificationPreferences,
    private readonly updateNotificationPreference: UpdateNotificationPreference
  ) {}

  async list({
    query,
    user
  }: {
    query: { limit?: string; cursor?: string; unreadOnly?: string }
    user: User
  }) {
    const limit = query.limit ? Number(query.limit) : undefined
    return await this.listNotifications.execute({
      userId: user.id,
      limit: Number.isFinite(limit) ? limit : undefined,
      cursor: query.cursor,
      unreadOnly: query.unreadOnly === 'true'
    })
  }

  async unreadCount({ user }: { user: User }) {
    return await this.countUnreadNotifications.execute(user.id)
  }

  async markAsRead({ params, user }: { params: { id: string }; user: User }) {
    return await this.markNotificationAsRead.execute(user.id, params.id)
  }

  async markAllAsRead({ user }: { user: User }) {
    return await this.markAllNotificationsAsRead.execute(user.id)
  }

  async preferences({ user }: { user: User }) {
    return await this.getNotificationPreferences.execute(user.id)
  }

  async updatePreference({
    params,
    body,
    user
  }: {
    params: { type: string }
    body: { pushEnabled?: boolean; inAppEnabled?: boolean }
    user: User
  }) {
    return await this.updateNotificationPreference.execute({
      userId: user.id,
      type: params.type as NotificationType,
      pushEnabled: body.pushEnabled,
      inAppEnabled: body.inAppEnabled
    })
  }
}
