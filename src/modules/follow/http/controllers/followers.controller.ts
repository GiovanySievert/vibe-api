import { User } from 'better-auth/types'
import { IsFollowing } from '../../application/use-cases'
import { appLogger } from '@src/config/logger'

export class FollowersController {
  constructor(private readonly isFollowing: IsFollowing) {}

  async checkIsFollowing(data: any) {
    try {
      return await this.isFollowing.execute(data.followingId, data.followerId)
    } catch (error) {
      appLogger.error('Failed to check if user is following', {
        followingId: data.followingId,
        followerId: data.followerId,
        error
      })
      throw error
    }
  }
}
