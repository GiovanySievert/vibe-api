import { eq, like } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { PublicUserRepository } from '../../domain/repositories'
import { users } from '@src/infra/database/schema'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class DrizzlePublicUserRepository implements PublicUserRepository {
  async getUserById(userId: string): Promise<Users> {
    const [result] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    return result
  }

  async getUserByUsername(username: string): Promise<Users[]> {
    const result = await db
      .select()
      .from(users)
      .where(like(users.username, `%${username}%`))
      .limit(10)

    return result
  }
}
