import { PublicUserProfile, PublicUserRepository } from '../../domain/repositories'

export class GetPublicUserByUsername {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(username: string, userIdToExclude: string): Promise<PublicUserProfile[]> {
    const user = await this.publicUserRepo.getUserByUsername(username, userIdToExclude)

    return user
  }
}
