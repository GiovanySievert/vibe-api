import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export class DeletePlaceReview {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string): Promise<void> {
    await this.placeReviewRepo.delete(reviewId)
  }
}
