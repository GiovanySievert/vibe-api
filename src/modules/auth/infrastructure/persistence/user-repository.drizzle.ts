import { eq } from 'drizzle-orm'
import { UserRepository } from '../../domain/repositories/user-repository'
import { users } from '../../application'
import { db } from '@src/infra/database/client'

export class DrizzleUserRepository implements UserRepository {
  async existsByUsername(username: string): Promise<boolean> {
    const [result] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1)

    return !!result
  }
}
