import { StreakRepository } from '../../domain/repositories'
import { FriendsStreakResponse } from '../../domain/types'

export class GetFollowedStreaks {
  constructor(private readonly streakRepo: StreakRepository) {}

  async execute(userId: string, limit = 5): Promise<FriendsStreakResponse> {
    const friends = await this.streakRepo.getFollowedActiveStreaks(userId, limit)

    return {
      count: friends.length,
      friends
    }
  }
}
