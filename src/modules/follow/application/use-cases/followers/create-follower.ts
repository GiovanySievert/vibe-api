import { Followers } from '@src/modules/follow/domain/mappers'
import { FollowersRepository } from '@src/modules/follow/domain/repositories'

export type CreateFollowerData = Omit<Followers, 'id' | 'createdAt'>

export class CreateFollower {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(data: CreateFollowerData): Promise<Followers> {
    const follower = await this.followersRepo.create(data)
    return follower
  }
}
