import {
  PushNotificationDeliveryResult,
  PushNotificationMessage,
  PushSender
} from '../../application/ports/push-sender'

export class MockPushSender implements PushSender {
  public calls: PushNotificationMessage[][] = []
  public nextResults: PushNotificationDeliveryResult[] | null = null
  public resultsByToken = new Map<string, PushNotificationDeliveryResult>()

  async send(messages: PushNotificationMessage[]): Promise<PushNotificationDeliveryResult[]> {
    this.calls.push([...messages])
    if (this.nextResults) {
      return this.nextResults
    }
    return messages.map((message) => {
      const override = this.resultsByToken.get(message.to)
      if (override) return override
      return { token: message.to, status: 'ok', id: `id-${message.to}` }
    })
  }
}
