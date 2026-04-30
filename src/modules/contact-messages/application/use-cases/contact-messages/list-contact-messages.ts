import { ContactMessageRepository } from '../../../domain/repositories'
import { ContactMessage } from '../../../domain/mappers'

export class ListContactMessages {
  constructor(private readonly contactMessageRepository: ContactMessageRepository) {}

  async execute(): Promise<ContactMessage[]> {
    return await this.contactMessageRepository.listAll()
  }
}
