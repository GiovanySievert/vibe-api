import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export class ListPlaceReviews {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async executeByPlace(placeId: string, page?: number): Promise<PlaceReview[]> {
    return await this.placeReviewRepo.listByPlace(placeId, page)
  }

  async executeByUser(userId: string, page?: number): Promise<PlaceReview[]> {
    return await this.placeReviewRepo.listByUser(userId, page)
  }
}
