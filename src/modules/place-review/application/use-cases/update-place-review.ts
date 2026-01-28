import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export type UpdatePlaceReviewData = Partial<Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'placeId'>>

export class UpdatePlaceReview {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string, data: UpdatePlaceReviewData): Promise<PlaceReview> {
    return await this.placeReviewRepo.update(reviewId, data)
  }
}
