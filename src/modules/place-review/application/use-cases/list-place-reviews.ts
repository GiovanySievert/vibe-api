import { FollowChecker, PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { FeedReviewItem } from '@src/modules/place-review/domain/types'
import { applySelfieVisibility } from '@src/modules/place-review/application/services/selfie-visibility'

export class ListPlaceReviews {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly followChecker: FollowChecker
  ) {}

  async executeByPlace(placeId: string, since: Date, page: number | undefined, viewerId: string): Promise<FeedReviewItem[]> {
    const items = await this.placeReviewRepo.listByPlace(placeId, since, page, viewerId)
    return applySelfieVisibility(items, viewerId, this.followChecker)
  }

  async executeByUser(userId: string, page: number | undefined, viewerId: string): Promise<FeedReviewItem[]> {
    const items = await this.placeReviewRepo.listByUser(userId, page, viewerId)
    return applySelfieVisibility(items, viewerId, this.followChecker)
  }

  async executePopularByPlace(placeId: string, since: Date, limit: number, viewerId: string): Promise<FeedReviewItem[]> {
    const items = await this.placeReviewRepo.listPopularByPlace(placeId, since, limit, viewerId)
    return applySelfieVisibility(items, viewerId, this.followChecker)
  }
}
