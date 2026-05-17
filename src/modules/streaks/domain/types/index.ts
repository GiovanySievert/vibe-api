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

export type StreakUpdateResult = {
  triggered: boolean
  previousStreak: number
  currentStreak: number
  longestStreak: number
  weeklyThreshold: number
  reviewCount: number
  isoYear: number
  isoWeek: number
}

export type FriendStreakSummary = {
  userId: string
  name: string
  username: string
  image: string | null
  currentStreak: number
}

export type FriendsStreakResponse = {
  count: number
  friends: FriendStreakSummary[]
}
