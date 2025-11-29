import { EmailSender } from './application/ports/email-sender'
import { ResendEmailSender } from './infrastructure/email/resend-email-sender'

export class NotificationsModule {
  public readonly emailSender: EmailSender

  constructor(apiKey: string, from: string) {
    this.emailSender = new ResendEmailSender(apiKey, from)
  }
}
