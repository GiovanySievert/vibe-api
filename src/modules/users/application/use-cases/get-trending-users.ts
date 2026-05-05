import { PublicUserRepository, TrendingUser } from '../../domain/repositories'

export class GetTrendingUsers {
  constructor(private readonly publicUserRepo: PublicUserRepository) {}

  async execute(userId: string, limit?: number): Promise<TrendingUser[]> {
    return this.publicUserRepo.getTrending(userId, limit)
  }
}
