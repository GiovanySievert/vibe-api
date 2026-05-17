import { UserStreak, UserWeeklyActivity } from '../mappers'
import { FriendStreakSummary } from '../types'

export interface StreakRepository {
  getStreak(userId: string): Promise<UserStreak | null>
  upsertWeeklyActivity(userId: string, isoYear: number, isoWeek: number): Promise<UserWeeklyActivity>
  updateStreak(userId: string, currentStreak: number, longestStreak: number, isoYear: number, isoWeek: number): Promise<UserStreak | null>
  getWeeklyActivity(userId: string, limit?: number): Promise<UserWeeklyActivity[]>
  getWeekActivity(userId: string, isoYear: number, isoWeek: number): Promise<UserWeeklyActivity | null>
  getFollowedActiveStreaks(userId: string, limit?: number): Promise<FriendStreakSummary[]>
}
