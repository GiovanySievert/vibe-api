import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { DrizzlePlaceReviewRepository } from '@src/modules/place-review/infrastructure/persistence'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import {
  EvaluateUserPlaceBadge,
  GetUserBadgeForPlace,
  ListUserBadges
} from './application/use-cases'
import { DrizzleUserPlaceBadgesRepository } from './infrastructure/persistence'
import { BadgesController } from './infrastructure/http/controllers/badges.controller'

export class BadgesModule {
  public readonly controller: BadgesController
  public readonly evaluateUserPlaceBadge: EvaluateUserPlaceBadge

  constructor(deps?: { placeReviewRepo?: PlaceReviewRepository; producer?: RabbitMQProducer }) {
    const placeReviewRepo = deps?.placeReviewRepo ?? new DrizzlePlaceReviewRepository()
    const producer = deps?.producer ?? new RabbitMQProducer()
    const userPlaceBadgesRepo = new DrizzleUserPlaceBadgesRepository()

    this.evaluateUserPlaceBadge = new EvaluateUserPlaceBadge(
      placeReviewRepo,
      userPlaceBadgesRepo,
      producer
    )

    const listUserBadges = new ListUserBadges(userPlaceBadgesRepo, placeReviewRepo)
    const getUserBadgeForPlace = new GetUserBadgeForPlace(userPlaceBadgesRepo, placeReviewRepo)

    this.controller = new BadgesController(listUserBadges, getUserBadgeForPlace)
  }
}
