import { FollowersRepository } from '@src/modules/follow/domain/repositories'

export class IsFollowing {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(followingId: string, followerId: string): Promise<boolean> {
    const followers = await this.followersRepo.isFollowing(followingId, followerId)

    return followers
  }
}
