export const NOTIFICATION_TYPES = ['event_invitation', 'follow_request_created'] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export interface NotificationPayload {
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> & { url?: string }
}

export interface ResolvedNotification {
  userIds: string[]
  payload: NotificationPayload
}
