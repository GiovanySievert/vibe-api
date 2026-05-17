import { PublicUserProfile, PublicUserRepository } from '../../domain/repositories'

export class GetPublicUserById {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(userId: string, loggedUserId: string): Promise<PublicUserProfile | null> {
    const user = await this.publicUserRepo.getUserById(userId, loggedUserId)
    return user
  }
}
