import { and, eq, like, ne, isNull } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { PublicUserRepository } from '../../domain/repositories'
import { users, userBlocks } from '@src/infra/database/schema'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class DrizzlePublicUserRepository implements PublicUserRepository {
  async getUserById(userId: string, loggedUserId: string): Promise<Users | null> {
    const [result] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .leftJoin(userBlocks, and(eq(userBlocks.blockerId, users.id), eq(userBlocks.blockedId, loggedUserId)))
      .where(and(eq(users.id, userId), isNull(userBlocks.id)))
      .limit(1)

    return result || null
  }

  async getUserByUsername(username: string, userIdToExclude: string): Promise<Users[]> {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .leftJoin(userBlocks, and(eq(userBlocks.blockerId, users.id), eq(userBlocks.blockedId, userIdToExclude)))
      .where(and(like(users.username, `%${username}%`), ne(users.id, userIdToExclude), isNull(userBlocks.id)))
      .limit(10)

    return result
  }
}
