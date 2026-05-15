import { DeleteFollower } from './delete-follower'
import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { FollowRelationshipNotFoundException } from '@src/modules/follow/domain/exceptions'
import { DecrementFollowersStats } from '../follow-stats/decrement-followers-stats'
import { DecrementFollowingStats } from '../follow-stats/decrement-following-stats'

export class Unfollow {
  constructor(
    private readonly followersRepo: FollowersRepository,
    private readonly deleteFollower: DeleteFollower,
    private readonly decrementFollowingStats: DecrementFollowingStats,
    private readonly decrementFollowersStats: DecrementFollowersStats
  ) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    const followRelationship = await this.followersRepo.getByFollowerAndFollowing(followerId, followingId)

    if (!followRelationship) {
      throw new FollowRelationshipNotFoundException(followerId, followingId)
    }

    await this.deleteFollower.execute(followRelationship.id)
    await this.decrementFollowingStats.execute(followerId)
    await this.decrementFollowersStats.execute(followingId)
  }
}
