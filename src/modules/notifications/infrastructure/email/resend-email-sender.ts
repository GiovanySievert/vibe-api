import { Resend } from 'resend'
import { EmailSender } from '../../application/ports/email-sender'

export class ResendEmailSender implements EmailSender {
  constructor(private apiKey: string, private from: string) {}
  private client = new Resend(this.apiKey)

  async send(to: string, subject: string, html: string) {
    await this.client.emails.send({ from: this.from, to, subject, html })
  }
}
