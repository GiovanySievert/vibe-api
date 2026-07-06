import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { FeedReviewItem } from '@src/modules/place-review/domain/types'
import { applyAnonymity } from '@src/modules/place-review/application/services/anonymity'

export class ListPlaceReviews {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async executeByPlace(placeId: string, since: Date, page: number | undefined, viewerId: string): Promise<FeedReviewItem[]> {
    const items = await this.placeReviewRepo.listByPlace(placeId, since, page, viewerId)
    return applyAnonymity(items, viewerId)
  }

  async executeByUser(userId: string, page: number | undefined, viewerId: string): Promise<FeedReviewItem[]> {
    const items = await this.placeReviewRepo.listByUser(userId, page, viewerId)
    return applyAnonymity(items, viewerId)
  }

  async executePopularByPlace(placeId: string, since: Date, limit: number, viewerId: string): Promise<FeedReviewItem[]> {
    const items = await this.placeReviewRepo.listPopularByPlace(placeId, since, limit, viewerId)
    return applyAnonymity(items, viewerId)
  }
}
