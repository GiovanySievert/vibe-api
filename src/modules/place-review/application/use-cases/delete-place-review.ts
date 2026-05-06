import { EvaluateUserPlaceBadge } from '@src/modules/badges/application/use-cases'
import { UnauthorizedPlaceReviewActionException } from '@src/modules/place-review/domain/exceptions'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export class DeletePlaceReview {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly evaluateUserPlaceBadge: EvaluateUserPlaceBadge
  ) {}

  async execute(reviewId: string, requestingUserId: string): Promise<void> {
    const review = await this.placeReviewRepo.getById(reviewId)
    if (!review) throw new Error('Review not found')
    if (review.userId !== requestingUserId) throw new UnauthorizedPlaceReviewActionException()
    await this.placeReviewRepo.delete(reviewId)

    try {
      await this.evaluateUserPlaceBadge.execute({ userId: review.userId, placeId: review.placeId })
    } catch (err) {
      console.error('failed to evaluate place badge', err)
    }
  }
}
