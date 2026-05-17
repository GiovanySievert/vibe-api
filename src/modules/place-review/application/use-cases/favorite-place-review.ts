import {
  PlaceReviewNotFoundException,
  UnauthorizedPlaceReviewActionException
} from '@src/modules/place-review/domain/exceptions'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export class FavoritePlaceReview {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string, userId: string): Promise<void> {
    const review = await this.placeReviewRepo.getById(reviewId)
    if (!review) throw new PlaceReviewNotFoundException(reviewId)
    if (review.userId !== userId) throw new UnauthorizedPlaceReviewActionException()
    await this.placeReviewRepo.favoriteReview(userId, reviewId)
  }
}
