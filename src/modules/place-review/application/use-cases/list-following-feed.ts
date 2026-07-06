import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { FeedReviewItem } from '@src/modules/place-review/domain/types'
import { applyAnonymity } from '@src/modules/place-review/application/services/anonymity'

export class ListFollowingFeed {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(userId: string, page?: number): Promise<FeedReviewItem[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const items = await this.placeReviewRepo.listFollowingFeed(userId, since, page)
    return applyAnonymity(items, userId)
  }
}
