import { User } from 'better-auth/types'

import {
  GetUserBadgeForPlace,
  ListUserBadgeProgress,
  ListUserBadges,
  ListVisibleUserBadges,
  UpdateUserProfileBadges
} from '../../../application/use-cases'

export class BadgesController {
  constructor(
    private readonly listUserBadges: ListUserBadges,
    private readonly listVisibleUserBadges: ListVisibleUserBadges,
    private readonly listUserBadgeProgress: ListUserBadgeProgress,
    private readonly getUserBadgeForPlace: GetUserBadgeForPlace,
    private readonly updateUserProfileBadges: UpdateUserProfileBadges
  ) {}

  async listMine({ user }: { user: User }) {
    return await this.listUserBadges.execute(user.id)
  }

  async listByUser({ params }: { params: { userId: string } }) {
    return await this.listVisibleUserBadges.execute(params.userId)
  }

  async listProgressMine({ user }: { user: User }) {
    return await this.listUserBadgeProgress.execute(user.id)
  }

  async getForPlace({ params }: { params: { userId: string; placeId: string } }) {
    return await this.getUserBadgeForPlace.execute(params.userId, params.placeId)
  }

  async updateProfileSelection({ body, user }: { body: { placeIds: string[] }; user: User }) {
    return await this.updateUserProfileBadges.execute({ userId: user.id, placeIds: body.placeIds })
  }
}
