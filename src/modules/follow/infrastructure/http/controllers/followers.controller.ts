import { IsFollowing, Unfollow } from '../../../application/use-cases'
import { appLogger } from '@src/config/logger'
import { User } from 'better-auth/types'

export class FollowersController {
  constructor(
    private readonly isFollowing: IsFollowing,
    private readonly unfollow: Unfollow
  ) {}

  async checkIsFollowing({ params, session }: { params: { userId: string }; session: { userId: string } }) {
    try {
      return await this.isFollowing.execute(params.userId, session.userId)
    } catch (error) {
      appLogger.error('Failed to check if user is following', {
        followingId: params.userId,
        followerId: session.userId,
        error
      })
      throw error
    }
  }

  async unfollowUser({ params, user }: { params: { userId: string }; user: User }) {
    try {
      await this.unfollow.execute(user.id, params.userId)
      return { success: true }
    } catch (error) {
      appLogger.error('Failed to unfollow user', {
        followerId: user.id,
        followingId: params.userId,
        error
      })
      throw error
    }
  }
}
