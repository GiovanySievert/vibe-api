import { FollowersRepository } from '@src/modules/follow/domain/repositories'
import { ListUserFollowResponseDto } from '@src/modules/follow/infrastructure/http/dtos'

export class SearchFollowings {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(userId: string, q: string, page?: number, limit?: number): Promise<ListUserFollowResponseDto[]> {
    return this.followersRepo.searchFollowings(userId, q, page, limit)
  }
}
