import { StreakRepository } from '../../domain/repositories'
import { StreakSummary, WeeklyActivitySummary } from '../../domain/types'

export class GetUserStreak {
  constructor(private readonly streakRepo: StreakRepository) {}

  async execute(userId: string): Promise<{ streak: StreakSummary; recentActivity: WeeklyActivitySummary[] }> {
    const [streak, activity] = await Promise.all([
      this.streakRepo.getStreak(userId),
      this.streakRepo.getWeeklyActivity(userId, 12)
    ])

    return {
      streak: {
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
        weeklyThreshold: streak?.weeklyThreshold ?? 2,
        lastActiveWeek: streak?.lastActiveWeek ?? null,
        lastActiveYear: streak?.lastActiveYear ?? null
      },
      recentActivity: activity.map((a) => ({
        isoYear: a.isoYear,
        isoWeek: a.isoWeek,
        reviewCount: a.reviewCount,
        streakContributed: a.streakContributed
      }))
    }
  }
}
