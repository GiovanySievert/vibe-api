import { FollowersRepository } from '@src/modules/follow/domain/repositories'

export class DeleteFollower {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(followId: string): Promise<void> {
    await this.followersRepo.delete(followId)
  }
}
