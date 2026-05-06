import { User } from 'better-auth/types'

import { GetUserBadgeForPlace, ListUserBadges } from '../../../application/use-cases'

export class BadgesController {
  constructor(
    private readonly listUserBadges: ListUserBadges,
    private readonly getUserBadgeForPlace: GetUserBadgeForPlace
  ) {}

  async listMine({ user }: { user: User }) {
    return await this.listUserBadges.execute(user.id)
  }

  async listByUser({ params }: { params: { userId: string } }) {
    return await this.listUserBadges.execute(params.userId)
  }

  async getForPlace({ params }: { params: { userId: string; placeId: string } }) {
    return await this.getUserBadgeForPlace.execute(params.userId, params.placeId)
  }
}
