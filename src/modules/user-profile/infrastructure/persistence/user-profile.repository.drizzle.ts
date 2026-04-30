import { eq } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { users } from '@src/modules/auth/application/schemas'
import { UserProfile } from '../../domain/mappers'
import { UserProfileRepository } from '../../domain/repositories'

export class DrizzleUserProfileRepository implements UserProfileRepository {
  async update(userId: string, data: { name: string; bio: string | null }): Promise<UserProfile> {
    const [result] = await db
      .update(users)
      .set({ name: data.name, bio: data.bio })
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name, bio: users.bio, updatedAt: users.updatedAt })

    return result
  }
}
