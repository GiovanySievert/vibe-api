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

  async getFollowers({ params, query }: { params: { userId: string }; query: { page?: number } }) {
    return await this.listFollowers.execute(params.userId, query.page)
  }

  async getFollowings({ params, query }: { params: { userId: string }; query: { page?: number } }) {
    return await this.listFollowings.execute(params.userId, query.page)
  }
}
