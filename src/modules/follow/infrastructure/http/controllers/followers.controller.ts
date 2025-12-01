import { IsFollowing, Unfollow, ListFollowers, ListFollowings } from '../../../application/use-cases'
import { User } from 'better-auth/types'

export class FollowersController {
  constructor(
    private readonly isFollowing: IsFollowing,
    private readonly unfollow: Unfollow,
    private readonly listFollowers: ListFollowers,
    private readonly listFollowings: ListFollowings
  ) {}

  async checkIsFollowing({ params, session }: { params: { userId: string }; session: { userId: string } }) {
    return await this.isFollowing.execute(params.userId, session.userId)
  }

  async unfollowUser({ params, user }: { params: { userId: string }; user: User }) {
    await this.unfollow.execute(user.id, params.userId)
    return { success: true }
  }

  async getFollowers({ user }: { user: User }) {
    return await this.listFollowers.execute(user.id)
  }

  async getFollowings({ user }: { user: User }) {
    return await this.listFollowings.execute(user.id)
  }
}
