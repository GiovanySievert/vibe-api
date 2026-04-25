import { PushNotificationDeliveryResult, PushNotificationMessage, PushSender } from '../../application/ports/push-sender'

interface ExpoPushResponse {
  data?: Array<{
    status: 'ok' | 'error'
    id?: string
    message?: string
    details?: {
      error?: string
    }
  }>
}

export class ExpoPushSender implements PushSender {
  constructor(private readonly accessToken?: string) {}

  async send(messages: PushNotificationMessage[]): Promise<PushNotificationDeliveryResult[]> {
    if (messages.length === 0) {
      return []
    }

    const chunks = this.chunk(messages, 100)
    const results: PushNotificationDeliveryResult[] = []

    for (const chunk of chunks) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
          ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {})
        },
        body: JSON.stringify(chunk)
      })

      if (!response.ok) {
        throw new Error(`Expo push request failed with status ${response.status}`)
      }

      const payload = (await response.json()) as ExpoPushResponse
      const data = payload.data ?? []

      for (const [index, ticket] of data.entries()) {
        const message = chunk[index]

        results.push({
          token: message.to,
          status: ticket.status,
          id: ticket.id,
          message: ticket.message,
          details: ticket.details
        })
      }
    }

    return results
  }

  private chunk<T>(items: T[], size: number) {
    const chunks: T[][] = []

    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size))
    }

    return chunks
  }
}
