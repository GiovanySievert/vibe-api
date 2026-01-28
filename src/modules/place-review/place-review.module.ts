import {
  CreatePlaceReview,
  GetPlaceReview,
  ListPlaceReviews,
  UpdatePlaceReview,
  DeletePlaceReview
} from './application/use-cases'
import { DrizzlePlaceReviewRepository } from './infrastructure/persistence'
import { PlaceReviewController } from './infrastructure/http/controllers/place-review.controller'

export class PlaceReviewModule {
  public readonly placeReviewController: PlaceReviewController

  constructor() {
    const placeReviewRepo = new DrizzlePlaceReviewRepository()

    const createPlaceReviewService = new CreatePlaceReview(placeReviewRepo)
    const getPlaceReviewService = new GetPlaceReview(placeReviewRepo)
    const listPlaceReviewsService = new ListPlaceReviews(placeReviewRepo)
    const updatePlaceReviewService = new UpdatePlaceReview(placeReviewRepo)
    const deletePlaceReviewService = new DeletePlaceReview(placeReviewRepo)

    this.placeReviewController = new PlaceReviewController(
      createPlaceReviewService,
      getPlaceReviewService,
      listPlaceReviewsService,
      updatePlaceReviewService,
      deletePlaceReviewService
    )
  }
}
