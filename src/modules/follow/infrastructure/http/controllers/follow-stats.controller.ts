import { User } from 'better-auth/types'
import {
  IncrementFollowersStats,
  IncrementFollowingStats,
  DecrementFollowersStats,
  DecrementFollowingStats,
  ListFollowStats
} from '../../../application/use-cases'

export class FollowStatsController {
  constructor(
    private readonly incrementFollowersStats: IncrementFollowersStats,
    private readonly decrementFollowersStats: DecrementFollowersStats,
    private readonly incrementFollowingStats: IncrementFollowingStats,
    private readonly decrementFollowingStats: DecrementFollowingStats,
    private readonly listFollowStats: ListFollowStats
  ) {}

  async createFollow({ user }: { user: User }) {
    return await this.incrementFollowersStats.execute(user.id)
  }

  async createFollowing({ user }: { user: User }) {
    return await this.incrementFollowingStats.execute(user.id)
  }

  async deleteFollow({ user }: { user: User }) {
    return await this.decrementFollowersStats.execute(user.id)
  }

  async deleteFollowing({ user }: { user: User }) {
    return await this.decrementFollowingStats.execute(user.id)
  }

  async list({ params }: { params: { userId: string } }) {
    return await this.listFollowStats.execute(params.userId)
  }
}
