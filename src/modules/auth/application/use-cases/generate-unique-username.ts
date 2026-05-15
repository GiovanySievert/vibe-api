import { UserRepository } from '../../domain/repositories/user-repository'
import { buildCandidateUsername, seedFromEmail } from '../../domain/username/generate-username'

const MAX_ATTEMPTS = 5

export class GenerateUniqueUsername {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string | null | undefined): Promise<string> {
    const seed = seedFromEmail(email)

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidate = buildCandidateUsername(seed)
      const taken = await this.userRepo.existsByUsername(candidate)
      if (!taken) return candidate
    }

    throw new Error('Failed to generate a unique username after multiple attempts')
  }
}
