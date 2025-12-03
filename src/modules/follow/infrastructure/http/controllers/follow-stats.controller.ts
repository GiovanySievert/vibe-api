import { User } from 'better-auth/types'
import {
  IncrementFollowersStats,
  IncrementFollowingStats,
  DeleteFollowStats,
  DeleteFollowingStats,
  ListFollowStats
} from '../../../application/use-cases'

export class FollowStatsController {
  constructor(
    private readonly incrementFollowersStats: IncrementFollowersStats,
    private readonly deleteFollowStats: DeleteFollowStats,
    private readonly incrementFollowingStats: IncrementFollowingStats,
    private readonly deleteFollowingStats: DeleteFollowingStats,
    private readonly listFollowStats: ListFollowStats
  ) {}

  async createFollow({ user }: { user: User }) {
    return await this.incrementFollowersStats.execute(user.id)
  }

  async createFollowing({ user }: { user: User }) {
    return await this.incrementFollowingStats.execute(user.id)
  }

  async deleteFollow({ user }: { user: User }) {
    return await this.deleteFollowStats.execute(user.id)
  }

  async deleteFollowing({ user }: { user: User }) {
    return await this.deleteFollowingStats.execute(user.id)
  }

  async list({ params }: { params: { userId: string } }) {
    return await this.listFollowStats.execute(params.userId)
  }
}
