import { UserStreak, UserWeeklyActivity } from '../../domain/mappers'
import { StreakRepository } from '../../domain/repositories'
import { FriendStreakSummary } from '../../domain/types'

export class MockStreakRepository implements StreakRepository {
  public streaks = new Map<string, UserStreak>()
  public activities: UserWeeklyActivity[] = []
  public followedStreaks = new Map<string, FriendStreakSummary[]>()
  public updateStreakCalls: Array<{
    userId: string
    currentStreak: number
    longestStreak: number
    isoYear: number
    isoWeek: number
  }> = []

  async getStreak(userId: string): Promise<UserStreak | null> {
    return this.streaks.get(userId) ?? null
  }

  async upsertWeeklyActivity(userId: string, isoYear: number, isoWeek: number): Promise<UserWeeklyActivity> {
    const existing = this.activities.find(
      (a) => a.userId === userId && a.isoYear === isoYear && a.isoWeek === isoWeek
    )
    if (existing) {
      existing.reviewCount += 1
      return existing
    }
    const created: UserWeeklyActivity = {
      id: crypto.randomUUID(),
      userId,
      isoYear,
      isoWeek,
      reviewCount: 1,
      streakContributed: false,
      createdAt: new Date()
    }
    this.activities.push(created)
    return created
  }

  async updateStreak(
    userId: string,
    currentStreak: number,
    longestStreak: number,
    isoYear: number,
    isoWeek: number
  ): Promise<UserStreak | null> {
    const activity = this.activities.find((a) => a.userId === userId && a.isoYear === isoYear && a.isoWeek === isoWeek)

    if (!activity || activity.streakContributed) {
      return null
    }

    activity.streakContributed = true
    this.updateStreakCalls.push({ userId, currentStreak, longestStreak, isoYear, isoWeek })
    const existing = this.streaks.get(userId)
    const updated: UserStreak = {
      userId,
      currentStreak,
      longestStreak,
      lastActiveWeek: isoWeek,
      lastActiveYear: isoYear,
      weeklyThreshold: existing?.weeklyThreshold ?? 2,
      updatedAt: new Date()
    }
    this.streaks.set(userId, updated)
    return updated
  }

  async getWeeklyActivity(userId: string, limit = 12): Promise<UserWeeklyActivity[]> {
    return this.activities
      .filter((a) => a.userId === userId)
      .sort((a, b) => (b.isoYear - a.isoYear) * 100 + (b.isoWeek - a.isoWeek))
      .slice(0, limit)
  }

  async getWeekActivity(userId: string, isoYear: number, isoWeek: number): Promise<UserWeeklyActivity | null> {
    return (
      this.activities.find((a) => a.userId === userId && a.isoYear === isoYear && a.isoWeek === isoWeek) ?? null
    )
  }

  async getFollowedActiveStreaks(userId: string, limit = 5): Promise<FriendStreakSummary[]> {
    return (this.followedStreaks.get(userId) ?? []).slice(0, limit)
  }

  seedStreak(streak: UserStreak): void {
    this.streaks.set(streak.userId, streak)
  }

  seedActivity(activity: UserWeeklyActivity): void {
    this.activities.push(activity)
  }

  seedFollowedStreaks(userId: string, friends: FriendStreakSummary[]): void {
    this.followedStreaks.set(userId, friends)
  }
}
