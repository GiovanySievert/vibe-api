import { DeleteFollower } from './delete-follower'
import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import {
  FollowRelationshipNotFoundException,
  UnauthorizedFollowRequestActionException
} from '@src/modules/follow/domain/exceptions'
import { DeleteFollowStats } from '../follow-stats/decrement-followers-stats'
import { DeleteFollowingStats } from '../follow-stats/decrement-following-stats'

export class RemoveFollower {
  constructor(
    private readonly followersRepo: FollowersRepository,
    private readonly deleteFollower: DeleteFollower,
    private readonly decrementFollowingStats: DeleteFollowingStats,
    private readonly decrementFollowersStats: DeleteFollowStats
  ) {}

  async execute(loggedUserId: string, followId: string): Promise<void> {
    const follow = await this.followersRepo.getById(followId)

    if (!follow) {
      throw new FollowRelationshipNotFoundException('', '')
    }

    if (follow.followingId !== loggedUserId) {
      throw new UnauthorizedFollowRequestActionException(loggedUserId, 'remove this follower')
    }

    await this.deleteFollower.execute(follow.id)
    await this.decrementFollowingStats.execute(follow.followerId)
    await this.decrementFollowersStats.execute(follow.followingId)
  }
}
