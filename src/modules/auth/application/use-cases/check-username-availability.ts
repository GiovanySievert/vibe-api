import { UserRepository } from '../../domain/repositories/user-repository'

export class CheckUsernameAvailability {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(username: string): Promise<{ available: boolean }> {
    const exists = await this.userRepo.existsByUsername(username)
    return { available: !exists }
  }
}
