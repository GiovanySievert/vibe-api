import { eq, sql } from 'drizzle-orm'

import { followStats } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { FollowStats } from '../../domain/mappers'
import { FollowStatsRepository } from '../../domain/repositories'

export class DrizzleFollowStatsRepository implements FollowStatsRepository {
  async incrementFollowersStats(userId: string): Promise<FollowStats> {
    const [result] = await db
      .insert(followStats)
      .values({ userId, followersCount: 1 })
      .onConflictDoUpdate({
        target: followStats.userId,
        set: { followersCount: sql`${followStats.followersCount} + 1` }
      })
      .returning()

    return result
  }

  async decrementFollowersStats(userId: string): Promise<void> {
    await db
      .update(followStats)
      .set({ followersCount: sql`${followStats.followersCount} - 1` })
      .where(eq(followStats.userId, userId))
  }

  async incrementFollowingStats(userId: string): Promise<FollowStats> {
    const [result] = await db
      .insert(followStats)
      .values({ userId, followingCount: 1 })
      .onConflictDoUpdate({
        target: followStats.userId,
        set: { followingCount: sql`${followStats.followingCount} + 1` }
      })
      .returning()

    return result
  }

  async decrementFollowingStats(userId: string): Promise<void> {
    await db
      .update(followStats)
      .set({ followingCount: sql`${followStats.followingCount} - 1` })
      .where(eq(followStats.userId, userId))
  }

  async listFollowStats(userId: string): Promise<FollowStats> {
    const [result] = await db.select().from(followStats).where(eq(followStats.userId, userId))

    return result
  }
}
