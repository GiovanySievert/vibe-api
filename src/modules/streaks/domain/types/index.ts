export type StreakSummary = {
  currentStreak: number
  longestStreak: number
  weeklyThreshold: number
  lastActiveWeek: number | null
  lastActiveYear: number | null
}

export type WeeklyActivitySummary = {
  isoYear: number
  isoWeek: number
  reviewCount: number
  streakContributed: boolean
}
