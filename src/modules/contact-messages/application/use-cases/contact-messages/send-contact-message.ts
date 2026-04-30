import { ContactMessageRepository } from '../../../domain/repositories'
import { ContactMessage } from '../../../domain/mappers'

export class SendContactMessage {
  constructor(private readonly contactMessageRepository: ContactMessageRepository) {}

  async execute(userId: string, message: string): Promise<ContactMessage> {
    return await this.contactMessageRepository.create(userId, message)
  }
}
