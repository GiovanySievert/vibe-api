import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export type CreatePlaceReviewData = Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>

export class CreatePlaceReview {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(data: CreatePlaceReviewData): Promise<PlaceReview> {
    const review = await this.placeReviewRepo.create(data)
    return review
  }
}
