import {
  CreatePlaceReview,
  CreatePlaceReviewComment,
  DeletePlaceReviewComment,
  FavoritePlaceReview,
  GetPlaceReview,
  GetPlaceReviewCounts,
  GetPlaceReviewEligibility,
  GetReviewInteractionCount,
  ListPlaceReviewFriends,
  ListPlaceReviews,
  ListFollowingFeed,
  ListPlaceReviewComments,
  ListReviewInteractions,
  RemovePlaceReviewReaction,
  SetPlaceReviewReaction,
  UpdatePlaceReview,
  DeletePlaceReview,
  UnfavoritePlaceReview
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
      cooldownMinutes: env.PLACE_REVIEW_COOLDOWN_MINUTES,
      maxDistanceMeters: env.PLACE_REVIEW_MAX_DISTANCE_METERS
    }

    const getPlaceReviewCountsService = new GetPlaceReviewCounts(placeReviewRepo)
    const getReviewInteractionCountService = new GetReviewInteractionCount(placeReviewRepo)
    const listPlaceReviewFriendsService = new ListPlaceReviewFriends(placeReviewRepo)
    const listReviewInteractionsService = new ListReviewInteractions(placeReviewRepo)
    const deletePlaceReviewCommentService = new DeletePlaceReviewComment(placeReviewRepo)

    const createPlaceReviewService = new CreatePlaceReview(
      placeReviewRepo,
      producer,
      recordWeeklyActivity,
      evaluateUserPlaceBadge,
      placeReviewConfig
    )
    const getPlaceReviewEligibilityService = new GetPlaceReviewEligibility(placeReviewRepo, {
      cooldownMinutes: placeReviewConfig.cooldownMinutes
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
    const favoritePlaceReviewService = new FavoritePlaceReview(placeReviewRepo)
    const unfavoritePlaceReviewService = new UnfavoritePlaceReview(placeReviewRepo)

    this.placeReviewController = new PlaceReviewController(
      createPlaceReviewService,
      createPlaceReviewCommentService,
      deletePlaceReviewCommentService,
      getPlaceReviewService,
      getPlaceReviewCountsService,
      getPlaceReviewEligibilityService,
      getReviewInteractionCountService,
      listPlaceReviewFriendsService,
      listPlaceReviewsService,
      listFollowingFeedService,
      listPlaceReviewCommentsService,
      listReviewInteractionsService,
      setPlaceReviewReactionService,
      removePlaceReviewReactionService,
      updatePlaceReviewService,
      deletePlaceReviewService,
      favoritePlaceReviewService,
      unfavoritePlaceReviewService,
      applicationEventBus
    )
  }
}
