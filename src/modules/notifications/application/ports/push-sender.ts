export interface PushNotificationMessage {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: 'default'
}

export interface PushNotificationDeliveryResult {
  token: string
  status: 'ok' | 'error'
  id?: string
  message?: string
  details?: {
    error?: string
  }
}

export interface PushSender {
  send(messages: PushNotificationMessage[]): Promise<PushNotificationDeliveryResult[]>
}
