import { GetUserStreak } from '../../../application/use-cases'
import { User } from 'better-auth/types'

export class StreakController {
  constructor(private readonly getUserStreak: GetUserStreak) {}

  async getMyStreak({ user }: { user: User }) {
    return this.getUserStreak.execute(user.id)
  }

  async getStreakByUserId({ params }: { params: { userId: string } }) {
    return this.getUserStreak.execute(params.userId)
  }
}
