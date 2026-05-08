import { PublicUserRepository, TrendingUser, WeekRef } from '../../domain/repositories'

export class GetTrendingUsers {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  execute(userId: string, limit?: number): Promise<TrendingUser[]> {
    const weeks = this.buildRecentWeeks(4)
    return this.publicUserRepo.getTrending(userId, weeks, limit)
  }

  private buildRecentWeeks(count: number): WeekRef[] {
    return Array.from({ length: count }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i * 7)
      d.setDate(d.getDate() + 4 - (d.getDay() || 7))
      const isoYear = d.getFullYear()
      const jan1 = new Date(isoYear, 0, 1)
      const isoWeek = Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + 1) / 7)
      return { isoYear, isoWeek }
    })
  }
}
