import { eq } from 'drizzle-orm'
import { UserRepository } from '../../domain/repositories/user-repository'
import { db } from '@src/infra/database/client'
import { users } from '../../application/schemas'

export class DrizzleUserRepository implements UserRepository {
  async existsByUsername(username: string): Promise<boolean> {
    const [result] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1)

    return !!result
  }

  async findUsernameOwnerId(username: string): Promise<string | null> {
    const [result] = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1)

    return result?.id ?? null
  }

  async updateUsername(userId: string, username: string): Promise<void> {
    await db.update(users).set({ username }).where(eq(users.id, userId))
  }
}
