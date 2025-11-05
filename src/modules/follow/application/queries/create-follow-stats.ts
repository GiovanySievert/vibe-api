import { FollowStats } from '../../domain/mappers'
import { FollowStatsRepository } from '../../domain/repositories'

export class CreateFollowStats {
  constructor(private readonly followStatsRepo: FollowStatsRepository) {}

  async execute(data: any): Promise<FollowStats> {
    const follower = await this.followStatsRepo.create(data)
    return follower
  }
}
