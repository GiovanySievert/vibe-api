import {
  CreatePlaceReview,
  CreatePlaceReviewComment,
  GetPlaceReview,
  GetPlaceReviewCounts,
  GetPlaceReviewEligibility,
  ListPlaceReviews,
  ListFollowingFeed,
  ListPlaceReviewComments,
  RemovePlaceReviewReaction,
  SetPlaceReviewReaction,
  UpdatePlaceReview,
  DeletePlaceReview
} from './application/use-cases'
import { DrizzleFollowChecker, DrizzlePlaceReviewRepository } from './infrastructure/persistence'
import { PlaceReviewController } from './infrastructure/http/controllers/place-review.controller'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { applicationEventBus } from '@src/shared/application/events'
import { recordWeeklyActivity } from '@src/modules/streaks/streak.module'
import { BadgesModule } from '@src/modules/badges/badges.module'
import { env } from '@src/config/env'

export class PlaceReviewModule {
  public readonly placeReviewController: PlaceReviewController

  constructor() {
    const placeReviewRepo = new DrizzlePlaceReviewRepository()
    const followChecker = new DrizzleFollowChecker()
    const producer = new RabbitMQProducer()
    const badgesModule = new BadgesModule({ placeReviewRepo, producer })
    const evaluateUserPlaceBadge = badgesModule.evaluateUserPlaceBadge

    const placeReviewConfig = {
      cooldownHours: env.PLACE_REVIEW_COOLDOWN_HOURS,
      maxDistanceMeters: env.PLACE_REVIEW_MAX_DISTANCE_METERS
    }

    const getPlaceReviewCountsService = new GetPlaceReviewCounts(placeReviewRepo)

    const createPlaceReviewService = new CreatePlaceReview(
      placeReviewRepo,
      producer,
      recordWeeklyActivity,
      evaluateUserPlaceBadge,
      placeReviewConfig
    )
    const getPlaceReviewEligibilityService = new GetPlaceReviewEligibility(placeReviewRepo, {
      cooldownHours: placeReviewConfig.cooldownHours
    })
    const createPlaceReviewCommentService = new CreatePlaceReviewComment(placeReviewRepo)
    const getPlaceReviewService = new GetPlaceReview(placeReviewRepo)
    const listPlaceReviewsService = new ListPlaceReviews(placeReviewRepo, followChecker)
    const listFollowingFeedService = new ListFollowingFeed(placeReviewRepo, followChecker)
    const listPlaceReviewCommentsService = new ListPlaceReviewComments(placeReviewRepo)
    const setPlaceReviewReactionService = new SetPlaceReviewReaction(placeReviewRepo)
    const removePlaceReviewReactionService = new RemovePlaceReviewReaction(placeReviewRepo)
    const updatePlaceReviewService = new UpdatePlaceReview(placeReviewRepo)
    const deletePlaceReviewService = new DeletePlaceReview(placeReviewRepo, evaluateUserPlaceBadge)

    this.placeReviewController = new PlaceReviewController(
      createPlaceReviewService,
      createPlaceReviewCommentService,
      getPlaceReviewService,
      getPlaceReviewCountsService,
      getPlaceReviewEligibilityService,
      listPlaceReviewsService,
      listFollowingFeedService,
      listPlaceReviewCommentsService,
      setPlaceReviewReactionService,
      removePlaceReviewReactionService,
      updatePlaceReviewService,
      deletePlaceReviewService,
      applicationEventBus
    )
  }
}
