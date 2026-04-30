import { ContactMessage } from '../mappers'

export interface ContactMessageRepository {
  create(userId: string, message: string): Promise<ContactMessage>
  listAll(): Promise<ContactMessage[]>
}
