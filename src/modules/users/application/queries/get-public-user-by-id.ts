import { PublicUserRepository } from '../../domain/repositories'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class GetPublicUserById {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(userId: string): Promise<Users> {
    const user = await this.publicUserRepo.getUserById(userId)
    return user
  }
}
