import { eq } from 'drizzle-orm'

import { followers } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { Followers } from '../../domain/mappers'
import { GetFollowRequestByUser } from '../../http/dtos'
import { FollowersRepository } from '../../domain/repositories'

export class DrizzleFollowRepository implements FollowersRepository {
  async create(data: Followers): Promise<Followers> {
    const [result] = await db.insert(followers).values(data).returning()

    return result
  }

  async listByUser(userId: string): Promise<GetFollowRequestByUser[]> {
    const result = await db.select().from(followers).where(eq(followers.followingId, userId))

    return GetFollowRequestByUser.fromArray(result)
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
