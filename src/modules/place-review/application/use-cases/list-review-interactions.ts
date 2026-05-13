import { PlaceReviewRepository } from '../../domain/repositories'
import { ReviewInteractionUser } from '../../domain/types'

export class ListReviewInteractions {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewId: string, type: 'on' | 'off', page: number): Promise<ReviewInteractionUser[]> {
    return this.placeReviewRepo.listReactionUsers(reviewId, type, page)
  }
}
