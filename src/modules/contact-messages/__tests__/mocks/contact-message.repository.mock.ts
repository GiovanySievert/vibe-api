import { ContactMessage } from '../../domain/mappers'
import { ContactMessageRepository } from '../../domain/repositories'

export class MockContactMessageRepository implements ContactMessageRepository {
  private messages: ContactMessage[] = []

  async create(userId: string, message: string): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      userId,
      message,
      createdAt: new Date()
    }
    this.messages.push(newMessage)
    return newMessage
  }

  async listAll(): Promise<ContactMessage[]> {
    return [...this.messages]
  }

  reset() {
    this.messages = []
  }

  getAll() {
    return [...this.messages]
  }
}
