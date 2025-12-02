import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { ListUserFollowResponseDto } from '@src/modules/follow/infrastructure/http/dtos'

export class ListFollowers {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(userId: string, page?: number): Promise<ListUserFollowResponseDto[]> {
    const followers = await this.followersRepo.listFollowers(userId, page)

    return followers
  }
}
