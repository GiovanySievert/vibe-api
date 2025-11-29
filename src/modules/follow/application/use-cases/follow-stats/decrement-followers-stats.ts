import { FollowStatsRepository } from '@src/modules/follow/domain/repositories'

export class DeleteFollowStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(followId: string): Promise<void> {
    await this.followStatsRepo.decrementFollowersStats(followId)
  }
}
