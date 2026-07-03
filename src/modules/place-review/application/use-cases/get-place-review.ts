import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export class GetPlaceReview {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string, viewerId?: string): Promise<PlaceReview | null> {
    return await this.placeReviewRepo.getById(reviewId, viewerId)
  }
}
