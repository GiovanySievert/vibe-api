import { Followers } from '@src/modules/follow/domain/mappers'
import { FollowersRepository } from '@src/modules/follow/domain/repositories'

export class CreateFollower {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(data: any): Promise<Followers> {
    const follower = await this.followersRepo.create(data)
    return follower
  }
}
