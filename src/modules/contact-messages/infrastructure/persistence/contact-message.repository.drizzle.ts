import { db } from '@src/infra/database/client'
import { contactMessages } from '../../application/schemas'
import { ContactMessage } from '../../domain/mappers'
import { ContactMessageRepository } from '../../domain/repositories'

export class DrizzleContactMessageRepository implements ContactMessageRepository {
  async create(userId: string, message: string): Promise<ContactMessage> {
    const [result] = await db
      .insert(contactMessages)
      .values({ userId, message })
      .returning()

    return result
  }

  async listAll(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages)
  }
}
