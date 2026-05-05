import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { userStreaks, userWeeklyActivity } from '../../application/schemas'
import { StreakRepository } from '../../domain/repositories'
import { UserStreak, UserWeeklyActivity } from '../../domain/mappers'

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
  ): Promise<UserStreak> {
    const [result] = await db
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
}
