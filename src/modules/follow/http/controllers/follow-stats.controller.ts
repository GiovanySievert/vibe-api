import { User } from 'better-auth/types'
import {
  CreateFollowStats,
  DeleteFollowStats,
  CreateFollowingStats,
  DeleteFollowingStats,
  ListFollowStats
} from '../../application/queries'

export class FollowStatsController {
  constructor(
    private readonly createFollowStats: CreateFollowStats,
    private readonly deleteFollowStats: DeleteFollowStats,
    private readonly createFolloingStats: CreateFollowingStats,
    private readonly deleteFollowingStats: DeleteFollowingStats,
    private readonly listFollowStats: ListFollowStats
  ) {}

  async createFollow({ user }: { user: User }) {
    return await this.createFollowStats.execute(user.id)
  }

  async createFollowing({ user }: { user: User }) {
    return await this.createFolloingStats.execute(user.id)
  }

  async deleteFollow({ user }: { user: User }) {
    return await this.deleteFollowStats.execute(user.id)
  }

  async deleteFollowing({ user }: { user: User }) {
    return await this.deleteFollowingStats.execute(user.id)
  }

  async list({ user }: { user: User }) {
    return await this.listFollowStats.execute(user.id)
  }
}
