import { User } from 'better-auth/types'
import {
  CreateFollowStats,
  DeleteFollowStats,
  CreateFollowingStats,
  DeleteFollowingStats,
  ListFollowStats
} from '../../application/use-cases'
import { appLogger } from '@src/config/logger'

export class FollowStatsController {
  constructor(
    private readonly createFollowStats: CreateFollowStats,
    private readonly deleteFollowStats: DeleteFollowStats,
    private readonly createFolloingStats: CreateFollowingStats,
    private readonly deleteFollowingStats: DeleteFollowingStats,
    private readonly listFollowStats: ListFollowStats
  ) {}

  async createFollow({ user }: { user: User }) {
    try {
      return await this.createFollowStats.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to create follow stats', {
        userId: user.id,
        error
      })
      throw error
    }
  }

  async createFollowing({ user }: { user: User }) {
    try {
      return await this.createFolloingStats.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to create following stats', {
        userId: user.id,
        error
      })
      throw error
    }
  }

  async deleteFollow({ user }: { user: User }) {
    try {
      return await this.deleteFollowStats.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to delete follow stats', {
        userId: user.id,
        error
      })
      throw error
    }
  }

  async deleteFollowing({ user }: { user: User }) {
    try {
      return await this.deleteFollowingStats.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to delete following stats', {
        userId: user.id,
        error
      })
      throw error
    }
  }

  async list({ user }: { user: User }) {
    try {
      return await this.listFollowStats.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to list follow stats', {
        userId: user.id,
        error
      })
      throw error
    }
  }
}
