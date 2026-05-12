import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { ListUserFollowResponseDto } from '@src/modules/follow/infrastructure/http/dtos'

export class ListFollowers {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(userId: string, page?: number, limit?: number): Promise<ListUserFollowResponseDto[]> {
    return this.followersRepo.listFollowers(userId, page, limit)
  }
}
