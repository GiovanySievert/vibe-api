import { userStreaks, userWeeklyActivity } from '@src/infra/database/schema'

export type UserStreak = typeof userStreaks.$inferSelect
export type UserWeeklyActivity = typeof userWeeklyActivity.$inferSelect
