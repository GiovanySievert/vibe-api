import { FollowStatsRepository } from '@src/modules/follow/domain/repositories'

export class DecrementFollowersStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(userId: string): Promise<void> {
    await this.followStatsRepo.decrementFollowersStats(userId)
  }
}
