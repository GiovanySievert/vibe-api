import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { ListUserFollowResponseDto } from '@src/modules/follow/infrastructure/http/dtos'

export class ListFollowings {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(userId: string): Promise<ListUserFollowResponseDto[]> {
    const followings = await this.followersRepo.listFollowings(userId)
    return followings
  }
}
