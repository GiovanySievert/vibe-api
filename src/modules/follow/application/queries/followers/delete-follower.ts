import { FollowersRepository } from '@src/modules/follow/domain/repositories'

export class DeleteFollower {
  constructor(private readonly followersRepo: FollowersRepository) {}

  async execute(data: any): Promise<void> {
    await this.followersRepo.delete(data)
  }
}
