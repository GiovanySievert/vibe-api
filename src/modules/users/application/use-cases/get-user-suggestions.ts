import { PublicUserRepository, UserSuggestion } from '../../domain/repositories'

export class GetUserSuggestions {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(userId: string): Promise<UserSuggestion[]> {
    return this.publicUserRepo.getSuggestions(userId)
  }
}
