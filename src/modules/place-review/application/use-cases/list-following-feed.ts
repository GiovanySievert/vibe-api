import { FollowChecker, PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { FeedReviewItem } from '@src/modules/place-review/domain/types'
import { applySelfieVisibility } from '@src/modules/place-review/application/services/selfie-visibility'

export class ListFollowingFeed {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly followChecker: FollowChecker
  ) {}

  async execute(userId: string, page?: number): Promise<FeedReviewItem[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const items = await this.placeReviewRepo.listFollowingFeed(userId, since, page)
    return applySelfieVisibility(items, userId, this.followChecker)
  }
}
