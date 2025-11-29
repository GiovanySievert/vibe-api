import { PublicUserRepository } from '../../domain/repositories'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class GetPublicUserByUsername {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(username: string, userIdToExclude: string): Promise<Users[]> {
    const user = await this.publicUserRepo.getUserByUsername(username, userIdToExclude)

    return user
  }
}
