import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { DrizzlePlaceReviewRepository } from '@src/modules/place-review/infrastructure/persistence'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import {
  EvaluateUserPlaceBadge,
  GetUserBadgeForPlace,
  ListUserBadgeProgress,
  ListUserBadges,
  ListVisibleUserBadges,
  UpdateUserProfileBadges
} from './application/use-cases'
import { DrizzleUserPlaceBadgesRepository, DrizzleUserProfileBadgesRepository } from './infrastructure/persistence'
import { BadgesController } from './infrastructure/http/controllers/badges.controller'

export class BadgesModule {
  public readonly controller: BadgesController
  public readonly evaluateUserPlaceBadge: EvaluateUserPlaceBadge

  constructor(deps?: { placeReviewRepo?: PlaceReviewRepository; producer?: RabbitMQProducer }) {
    const placeReviewRepo = deps?.placeReviewRepo ?? new DrizzlePlaceReviewRepository()
    const producer = deps?.producer ?? new RabbitMQProducer()
    const userPlaceBadgesRepo = new DrizzleUserPlaceBadgesRepository()
    const userProfileBadgesRepo = new DrizzleUserProfileBadgesRepository()

    this.evaluateUserPlaceBadge = new EvaluateUserPlaceBadge(
      placeReviewRepo,
      userPlaceBadgesRepo,
      userProfileBadgesRepo,
      producer
    )

    const listUserBadges = new ListUserBadges(userPlaceBadgesRepo, userProfileBadgesRepo, placeReviewRepo)
    const listVisibleUserBadges = new ListVisibleUserBadges(placeReviewRepo)
    const listUserBadgeProgress = new ListUserBadgeProgress(placeReviewRepo)
    const getUserBadgeForPlace = new GetUserBadgeForPlace(userPlaceBadgesRepo, placeReviewRepo)
    const updateUserProfileBadges = new UpdateUserProfileBadges(placeReviewRepo, userProfileBadgesRepo)

    this.controller = new BadgesController(
      listUserBadges,
      listVisibleUserBadges,
      listUserBadgeProgress,
      getUserBadgeForPlace,
      updateUserProfileBadges
    )
  }
}
