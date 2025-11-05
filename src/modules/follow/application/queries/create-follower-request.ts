import { Followers } from '../../domain/mappers'
import { FollowersRepository } from '../../domain/repositories'

export class CreateFollowerRequest {
  constructor(private readonly followerRepo: FollowersRepository) {}

  async execute(data: any): Promise<Followers> {
    const follower = await this.followerRepo.create(data)
    return follower
  }
}
