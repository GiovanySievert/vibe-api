export const NOTIFICATION_TYPES = [
  'event_invitation',
  'follow_request_created',
  'follow_request_accepted',
  'event_comment_created',
  'place_review_comment',
  'place_review_reaction'
] as const

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
