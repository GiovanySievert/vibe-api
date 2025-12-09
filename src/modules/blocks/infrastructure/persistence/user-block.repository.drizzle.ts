import { db } from '@src/infra/database/client'
import { and, eq } from 'drizzle-orm'
import { userBlocks } from '../../application/schemas'
import { users } from '@src/modules/auth/application/schemas'
import { UserBlock } from '../../domain/mappers'
import { UserBlockRepository } from '../../domain/repositories'
import { GetBlockedUserDto, GetBlockedUserDtoMapper } from '../http/dtos'

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

  async listBlockedUsers(blockerId: string): Promise<GetBlockedUserDto[]> {
    const results = await db
      .select({
        userBlocks: {
          id: userBlocks.id,
          blockerId: userBlocks.blockerId,
          blockedId: userBlocks.blockedId,
          createdAt: userBlocks.createdAt
        },
        users: {
          id: users.id,
          username: users.username,
          avatar: users.image
        }
      })
      .from(userBlocks)
      .innerJoin(users, eq(userBlocks.blockedId, users.id))
      .where(eq(userBlocks.blockerId, blockerId))

    return GetBlockedUserDtoMapper.fromArray(results)
  }
}
