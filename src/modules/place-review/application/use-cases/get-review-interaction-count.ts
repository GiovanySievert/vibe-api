import { PlaceReviewRepository } from '../../domain/repositories'
import { ReviewInteractionCount } from '../../domain/types'

export class GetReviewInteractionCount {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string): Promise<ReviewInteractionCount> {
    return this.placeReviewRepo.countReactions(reviewId)
  }
}
