import { DeleteFollower } from './delete-follower'
import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { Followers } from '@src/modules/follow/domain/mappers'
import {
  FollowRelationshipNotFoundException,
  UnauthorizedFollowRequestActionException
} from '@src/modules/follow/domain/exceptions'
import { DecrementFollowersStats } from '../follow-stats/decrement-followers-stats'
import { DecrementFollowingStats } from '../follow-stats/decrement-following-stats'

export class RemoveFollower {
  constructor(
    private readonly followersRepo: FollowersRepository,
    private readonly deleteFollower: DeleteFollower,
    private readonly decrementFollowingStats: DecrementFollowingStats,
    private readonly decrementFollowersStats: DecrementFollowersStats
  ) {}

  async execute(loggedUserId: string, followId: string): Promise<void> {
    const follow = await this.followersRepo.getById(followId)

    if (!follow) {
      throw new FollowRelationshipNotFoundException(loggedUserId, followId)
    }

    await this.remove(loggedUserId, follow)
  }

  async executeByUsers(loggedUserId: string, followerId: string): Promise<void> {
    const follow = await this.followersRepo.getByFollowerAndFollowing(followerId, loggedUserId)

    if (!follow) {
      throw new FollowRelationshipNotFoundException(followerId, loggedUserId)
    }

    await this.remove(loggedUserId, follow)
  }

  private async remove(loggedUserId: string, follow: Followers): Promise<void> {
    if (follow.followingId !== loggedUserId) {
      throw new UnauthorizedFollowRequestActionException(loggedUserId, 'remove this follower')
    }

    await this.deleteFollower.execute(follow.id)
    await this.decrementFollowingStats.execute(follow.followerId)
    await this.decrementFollowersStats.execute(follow.followingId)
  }
}
