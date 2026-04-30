import { NotificationChannel } from '../../application/ports/notification-channel'
import { NotificationPayload } from '../../application/notification-types'

export class MockNotificationChannel implements NotificationChannel {
  public calls: { userIds: string[]; payload: NotificationPayload }[] = []
  public shouldFail = false

  constructor(public readonly name: 'in_app' | 'push') {}

  async send(userIds: string[], payload: NotificationPayload): Promise<void> {
    this.calls.push({ userIds: [...userIds], payload })
    if (this.shouldFail) {
      throw new Error(`mock ${this.name} channel failed`)
    }
  }
}
