import { User } from 'better-auth/types'
import { SendContactMessage, ListContactMessages } from '../../../application/use-cases'

export class ContactMessageController {
  constructor(
    private readonly sendContactMessage: SendContactMessage,
    private readonly listContactMessages: ListContactMessages
  ) {}

  async send({ body, user }: { body: { message: string }; user: User }) {
    return await this.sendContactMessage.execute(user.id, body.message)
  }

  async list({ user }: { user: User }) {
    return await this.listContactMessages.execute()
  }
}
