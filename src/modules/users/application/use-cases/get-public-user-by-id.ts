import { PublicUserRepository } from '../../domain/repositories'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class GetPublicUserById {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(userId: string, loggedUserId: string): Promise<Users | null> {
    const user = await this.publicUserRepo.getUserById(userId, loggedUserId)
    return user
  }
}
