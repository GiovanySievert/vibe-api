import { PlaceReviewNotFoundException } from '../../domain/exceptions'
import { PlaceReviewRepository } from '../../domain/repositories'
import { ReviewInteractionUser } from '../../domain/types'

export class ListReviewInteractions {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string, type: 'on' | 'off', page: number, viewerId: string): Promise<ReviewInteractionUser[]> {
    const review = await this.placeReviewRepo.getById(reviewId, viewerId)
    if (!review) throw new PlaceReviewNotFoundException(reviewId)
    return this.placeReviewRepo.listReactionUsers(reviewId, type, page, viewerId)
  }
}
