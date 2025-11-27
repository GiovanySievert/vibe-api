import { User } from 'better-auth/types'
import { IsFollowing } from '../../application/queries'

export class FollowersController {
  constructor(private readonly isFollowing: IsFollowing) {}

  async checkIsFollowing(data: any) {
    return await this.isFollowing.execute(data.followingId, data.followerId)
  }
}
