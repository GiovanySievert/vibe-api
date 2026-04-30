import { SendContactMessage, ListContactMessages } from './application/use-cases'
import { DrizzleContactMessageRepository } from './infrastructure/persistence'
import { ContactMessageController } from './infrastructure/http/controllers'

export class ContactMessagesModule {
  public readonly contactMessageController: ContactMessageController

  constructor() {
    const contactMessageRepo = new DrizzleContactMessageRepository()
    const sendContactMessageService = new SendContactMessage(contactMessageRepo)
    const listContactMessagesService = new ListContactMessages(contactMessageRepo)

    this.contactMessageController = new ContactMessageController(sendContactMessageService, listContactMessagesService)
  }
}
