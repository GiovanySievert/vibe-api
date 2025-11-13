import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

import { followStats } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowStats } from '../../domain/mappers'
import { FollowStatsRepository } from '../../domain/repositories'

export class DrizzleFollowStatsRepository implements FollowStatsRepository {
  async createFollow(userId: string): Promise<FollowStats> {
    const [result] = await db
      .insert(followStats)
      .values({
        userId,
        followersCount: sql`${followStats.followersCount} + 1`
      })
      .returning()

    return result
  }

  async deleteFollow(userId: string): Promise<void> {
    await db.insert(followStats).values({
      userId,
      followersCount: sql`${followStats.followersCount} - 1`
    })
  }

  async createFollowing(userId: string): Promise<FollowStats> {
    const [result] = await db
      .insert(followStats)
      .values({
        userId,
        followingCount: sql`${followStats.followersCount} + 1`
      })
      .returning()

    return result
  }

  async deleteFollowing(userId: string): Promise<void> {
    await db.insert(followStats).values({
      userId,
      followingCount: sql`${followStats.followersCount} - 1`
    })
  }

  async list(userId: string): Promise<FollowStats[]> {
    const result = await db.select().from(followStats).where(eq(followStats.userId, userId))

    return result
  }
  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
