import { IsFollowing } from '../../../application/use-cases'
import { appLogger } from '@src/config/logger'

export class FollowersController {
  constructor(private readonly isFollowing: IsFollowing) {}

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
}
