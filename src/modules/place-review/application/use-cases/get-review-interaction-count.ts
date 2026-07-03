import { PlaceReviewNotFoundException } from '../../domain/exceptions'
import { PlaceReviewRepository } from '../../domain/repositories'
import { ReviewInteractionCount } from '../../domain/types'

export class GetReviewInteractionCount {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string, viewerId: string): Promise<ReviewInteractionCount> {
    const review = await this.placeReviewRepo.getById(reviewId, viewerId)
    if (!review) throw new PlaceReviewNotFoundException(reviewId)
    return this.placeReviewRepo.countReactions(reviewId, viewerId)
  }
}
