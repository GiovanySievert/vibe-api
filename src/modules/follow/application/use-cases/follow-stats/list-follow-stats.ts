import { FollowStats } from '@src/modules/follow/domain/mappers'
import { FollowStatsRepository } from '@src/modules/follow/domain/repositories'
export class ListFollowStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(userId: string): Promise<FollowStats> {
    const followStats = await this.followStatsRepo.listFollowStats(userId)

    return (
      followStats ?? {
        userId,
        followersCount: 0,
        followingCount: 0,
        updatedAt: new Date()
      }
    )
  }
}
