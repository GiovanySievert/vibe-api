import { UserProfileRepository } from '../../domain/repositories'
import { UserProfile } from '../../domain/mappers'

export class UpdateUserProfile {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async execute(userId: string, data: { name: string; bio: string | null }): Promise<UserProfile> {
    return await this.userProfileRepository.update(userId, data)
  }
}
