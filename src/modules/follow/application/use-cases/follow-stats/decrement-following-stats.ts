import { FollowStatsRepository } from '@src/modules/follow/domain/repositories'

export class DecrementFollowingStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(userId: string): Promise<void> {
    await this.followStatsRepo.decrementFollowingStats(userId)
  }
}
