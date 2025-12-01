import { FollowStats } from '../../domain/mappers'
import { FollowStatsRepository } from '../../domain/repositories'

export class MockFollowStatsRepository implements FollowStatsRepository {
  private followStats: FollowStats[] = []

  async listFollowStats(userId: string): Promise<FollowStats[]> {
    return this.followStats.filter((fs) => fs.userId === userId)
  }

  async incrementFollowersStats(userId: string): Promise<FollowStats> {
    const existing = this.followStats.find((fs) => fs.userId === userId)
    if (existing) {
      existing.followersCount += 1
      existing.updatedAt = new Date()
      return existing
    }
    const newStats: FollowStats = {
      userId,
      followersCount: 1,
      followingCount: 0,
      updatedAt: new Date()
    }
    this.followStats.push(newStats)
    return newStats
  }

  async decrementFollowersStats(userId: string): Promise<void> {
    const existing = this.followStats.find((fs) => fs.userId === userId)
    if (existing && existing.followersCount > 0) {
      existing.followersCount -= 1
      existing.updatedAt = new Date()
    }
  }

  async incrementFollowingStats(userId: string): Promise<FollowStats> {
    const existing = this.followStats.find((fs) => fs.userId === userId)
    if (existing) {
      existing.followingCount += 1
      existing.updatedAt = new Date()
      return existing
    }
    const newStats: FollowStats = {
      userId,
      followersCount: 0,
      followingCount: 1,
      updatedAt: new Date()
    }
    this.followStats.push(newStats)
    return newStats
  }

  async decrementFollowingStats(userId: string): Promise<void> {
    const existing = this.followStats.find((fs) => fs.userId === userId)
    if (existing && existing.followingCount > 0) {
      existing.followingCount -= 1
      existing.updatedAt = new Date()
    }
  }

  reset() {
    this.followStats = []
  }

  seed(data: FollowStats[]) {
    this.followStats = [...data]
  }

  getAll() {
    return [...this.followStats]
  }
}
