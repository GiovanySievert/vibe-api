import { db } from '@src/infra/database/client'
import { and, eq } from 'drizzle-orm'
import { userBlocks } from '../../application/schemas'
import { UserBlock } from '../../domain/mappers'
import { UserBlockRepository } from '../../domain/repositories'

export class DrizzleUserBlockRepository implements UserBlockRepository {
  async create(blockerId: string, blockedId: string): Promise<UserBlock> {
    const [result] = await db
      .insert(userBlocks)
      .values({ blockerId, blockedId })
      .returning()

    return result
  }

  async delete(blockerId: string, blockedId: string): Promise<void> {
    await db
      .delete(userBlocks)
      .where(and(eq(userBlocks.blockerId, blockerId), eq(userBlocks.blockedId, blockedId)))
  }

  async findBlock(blockerId: string, blockedId: string): Promise<UserBlock | null> {
    const [result] = await db
      .select()
      .from(userBlocks)
      .where(and(eq(userBlocks.blockerId, blockerId), eq(userBlocks.blockedId, blockedId)))
      .limit(1)

    return result || null
  }

  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const block = await this.findBlock(blockerId, blockedId)
    return !!block
  }

  async listBlockedUsers(blockerId: string): Promise<UserBlock[]> {
    const results = await db.select().from(userBlocks).where(eq(userBlocks.blockerId, blockerId))

    return results
  }
}
