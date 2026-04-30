import { NotificationPayload } from '../notification-types'

export interface NotificationChannel {
  readonly name: 'in_app' | 'push'
  send(userIds: string[], payload: NotificationPayload): Promise<void>
}
