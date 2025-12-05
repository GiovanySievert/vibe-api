import {
  GetFollowStatus,
  Unfollow,
  RemoveFollower,
  ListFollowers,
  ListFollowings
} from '../../../application/use-cases'
import { User } from 'better-auth/types'

export class FollowersController {
  constructor(
    private readonly getFollowStatus: GetFollowStatus,
    private readonly unfollow: Unfollow,
    private readonly removeFollower: RemoveFollower,
    private readonly listFollowers: ListFollowers,
    private readonly listFollowings: ListFollowings
  ) {}

  async checkFollowStatus({ params, session }: { params: { userId: string }; session: { userId: string } }) {
    return await this.getFollowStatus.execute(session.userId, params.userId)
  }

  async unfollowUser({ params, user }: { params: { userId: string }; user: User }) {
    await this.unfollow.execute(user.id, params.userId)
  }

  async removeFollowerUser({ params, user }: { params: { followId: string }; user: User }) {
    await this.removeFollower.execute(user.id, params.followId)
  }

  async getFollowers({ params, query }: { params: { userId: string }; query: { page?: number } }) {
    return await this.listFollowers.execute(params.userId, query.page)
  }

  async getFollowings({ params, query }: { params: { userId: string }; query: { page?: number } }) {
    return await this.listFollowings.execute(params.userId, query.page)
  }
}
