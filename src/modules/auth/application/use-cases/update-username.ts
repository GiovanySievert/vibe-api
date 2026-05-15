import { UsernameAlreadyTakenException } from '../../domain/exceptions'
import { UserRepository } from '../../domain/repositories/user-repository'

export class UpdateUsername {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, username: string): Promise<{ username: string }> {
    const ownerId = await this.userRepo.findUsernameOwnerId(username)

    if (ownerId && ownerId !== userId) {
      throw new UsernameAlreadyTakenException()
    }

    if (ownerId === userId) {
      return { username }
    }

    await this.userRepo.updateUsername(userId, username)
    return { username }
  }
}
