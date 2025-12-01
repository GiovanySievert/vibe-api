import { DeleteFollower } from './delete-follower'
import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { FollowRelationshipNotFoundException } from '@src/modules/follow/domain/exceptions'
import { DeleteFollowStats } from '../follow-stats/decrement-followers-stats'
import { DeleteFollowingStats } from '../follow-stats/decrement-following-stats'

export class Unfollow {
  constructor(
    private readonly followersRepo: FollowersRepository,
    private readonly deleteFollower: DeleteFollower,
    private readonly decrementFollowingStats: DeleteFollowingStats,
    private readonly decrementFollowersStats: DeleteFollowStats
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
