import { FollowStatsRepository } from '@src/modules/follow/domain/repositories'

export class DeleteFollowingStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(userId: string): Promise<void> {
    await this.followStatsRepo.deleteFollowing(userId)
  }
}
