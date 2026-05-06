import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { ReviewCounts } from '@src/modules/place-review/domain/types'

export class GetPlaceReviewCounts {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(reviewIds: string[], viewerId?: string): Promise<ReviewCounts[]> {
    const counts = await this.placeReviewRepo.listCountsByReviewIds(reviewIds, viewerId)
    const countsById = new Map(counts.map((c) => [c.reviewId, c]))

    return reviewIds.map(
      (reviewId) => countsById.get(reviewId) ?? { reviewId, commentsCount: 0, onCount: 0, offCount: 0, viewerReaction: null }
    )
  }
}
