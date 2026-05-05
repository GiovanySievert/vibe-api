import { StreakRepository } from '../../domain/repositories'

function getISOWeekAndYear(date: Date): { isoWeek: number; isoYear: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const isoWeek = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { isoWeek, isoYear: d.getUTCFullYear() }
}

function getPreviousISOWeek(isoYear: number, isoWeek: number): { isoYear: number; isoWeek: number } {
  if (isoWeek === 1) {
    const dec28 = new Date(Date.UTC(isoYear - 1, 11, 28))
    return getISOWeekAndYear(dec28)
  }
  return { isoYear, isoWeek: isoWeek - 1 }
}

export class RecordWeeklyActivity {
  constructor(private readonly streakRepo: StreakRepository) {}

  async execute(userId: string, reviewedAt: Date = new Date()): Promise<void> {
    const { isoWeek, isoYear } = getISOWeekAndYear(reviewedAt)

    const activity = await this.streakRepo.upsertWeeklyActivity(userId, isoYear, isoWeek)

    const streak = await this.streakRepo.getStreak(userId)
    const threshold = streak?.weeklyThreshold ?? 2

    if (activity.reviewCount !== threshold) return

    const prev = getPreviousISOWeek(isoYear, isoWeek)
    const prevWeekActivity = await this.streakRepo.getWeekActivity(userId, prev.isoYear, prev.isoWeek)

    const prevWasActive = (prevWeekActivity?.reviewCount ?? 0) >= threshold

    const currentStreak = prevWasActive ? (streak?.currentStreak ?? 0) + 1 : 1
    const longestStreak = Math.max(currentStreak, streak?.longestStreak ?? 0)

    await this.streakRepo.updateStreak(userId, currentStreak, longestStreak, isoYear, isoWeek)
  }
}
