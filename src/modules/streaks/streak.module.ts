import { GetUserStreak, RecordWeeklyActivity } from './application/use-cases'
import { DrizzleStreakRepository } from './infrastructure/persistence'
import { StreakController } from './infrastructure/http/controllers/streak.controller'

const streakRepo = new DrizzleStreakRepository()

export const recordWeeklyActivity = new RecordWeeklyActivity(streakRepo)
export const streakController = new StreakController(new GetUserStreak(streakRepo))
