import { GetFollowedStreaks, GetUserStreak } from '../../../application/use-cases'
import { User } from 'better-auth/types'

export class StreakController {
  constructor(
    private readonly getUserStreak: GetUserStreak,
    private readonly getFollowedStreaks: GetFollowedStreaks
  ) {}

  async getMyStreak({ user }: { user: User }) {
    return this.getUserStreak.execute(user.id)
  }

  async getMyFriendsStreaks({ user, query }: { user: User; query: { limit?: number } }) {
    return this.getFollowedStreaks.execute(user.id, query.limit ?? 5)
  }

  async getStreakByUserId({ params }: { params: { userId: string } }) {
    return this.getUserStreak.execute(params.userId)
  }
}
