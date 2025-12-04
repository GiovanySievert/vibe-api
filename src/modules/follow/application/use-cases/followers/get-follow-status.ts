import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { FollowStatusResponseDto } from '@src/modules/follow/infrastructure/http/dtos'

export class GetFollowStatus {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(followerId: string, followingId: string): Promise<FollowStatusResponseDto> {
    const result = await this.followersRepo.getFollowStatus(followerId, followingId)

    return result
  }
}
