import { FollowStats } from '@src/modules/follow/domain/mappers'
import { FollowStatsRepository } from '@src/modules/follow/domain/repositories'

export class CreateFollowingStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(userId: string): Promise<FollowStats> {
    const follower = await this.followStatsRepo.incrementFollowingStats(userId)
    return follower
  }
}
