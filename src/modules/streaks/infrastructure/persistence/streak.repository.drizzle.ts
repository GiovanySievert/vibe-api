import { and, asc, desc, eq, gt, sql } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { followers } from '@src/modules/follow/application/schemas'
import { users } from '@src/infra/database/schema'
import { userStreaks, userWeeklyActivity } from '../../application/schemas'
import { StreakRepository } from '../../domain/repositories'
import { UserStreak, UserWeeklyActivity } from '../../domain/mappers'
import { FriendStreakSummary } from '../../domain/types'

export class DrizzleStreakRepository implements StreakRepository {
  async getStreak(userId: string): Promise<UserStreak | null> {
    const [result] = await db.select().from(userStreaks).where(eq(userStreaks.userId, userId))
    return result ?? null
  }

  async upsertWeeklyActivity(userId: string, isoYear: number, isoWeek: number): Promise<UserWeeklyActivity> {
    const [result] = await db
      .insert(userWeeklyActivity)
      .values({ userId, isoYear, isoWeek, reviewCount: 1 })
      .onConflictDoUpdate({
        target: [userWeeklyActivity.userId, userWeeklyActivity.isoYear, userWeeklyActivity.isoWeek],
        set: { reviewCount: sql`${userWeeklyActivity.reviewCount} + 1` }
      })
      .returning()

    return result
  }

  async updateStreak(
    userId: string,
    currentStreak: number,
    longestStreak: number,
    isoYear: number,
    isoWeek: number
  ): Promise<UserStreak | null> {
    return await db.transaction(async (tx) => {
      const [activity] = await tx
        .update(userWeeklyActivity)
        .set({ streakContributed: true })
        .where(
          and(
            eq(userWeeklyActivity.userId, userId),
            eq(userWeeklyActivity.isoYear, isoYear),
            eq(userWeeklyActivity.isoWeek, isoWeek),
            eq(userWeeklyActivity.streakContributed, false)
          )
        )
        .returning()

      if (!activity) {
        return null
      }

      const [result] = await tx
        .insert(userStreaks)
        .values({ userId, currentStreak, longestStreak, lastActiveWeek: isoWeek, lastActiveYear: isoYear })
        .onConflictDoUpdate({
          target: userStreaks.userId,
          set: {
            currentStreak,
            longestStreak,
            lastActiveWeek: isoWeek,
            lastActiveYear: isoYear,
            updatedAt: new Date()
          }
        })
        .returning()

      return result
    })
  }

  async getWeeklyActivity(userId: string, limit = 52): Promise<UserWeeklyActivity[]> {
    return db
      .select()
      .from(userWeeklyActivity)
      .where(eq(userWeeklyActivity.userId, userId))
      .orderBy(desc(userWeeklyActivity.isoYear), desc(userWeeklyActivity.isoWeek))
      .limit(limit)
  }

  async getWeekActivity(userId: string, isoYear: number, isoWeek: number): Promise<UserWeeklyActivity | null> {
    const [result] = await db
      .select()
      .from(userWeeklyActivity)
      .where(
        and(
          eq(userWeeklyActivity.userId, userId),
          eq(userWeeklyActivity.isoYear, isoYear),
          eq(userWeeklyActivity.isoWeek, isoWeek)
        )
    )
    return result ?? null
  }

  async getFollowedActiveStreaks(userId: string, limit = 5): Promise<FriendStreakSummary[]> {
    return db
      .select({
        userId: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        currentStreak: userStreaks.currentStreak
      })
      .from(followers)
      .innerJoin(users, eq(followers.followingId, users.id))
      .innerJoin(userStreaks, eq(userStreaks.userId, followers.followingId))
      .where(and(eq(followers.followerId, userId), gt(userStreaks.currentStreak, 0)))
      .orderBy(desc(userStreaks.currentStreak), asc(users.username))
      .limit(limit)
  }
}
