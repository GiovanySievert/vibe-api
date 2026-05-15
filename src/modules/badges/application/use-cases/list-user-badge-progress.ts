import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import { PLACE_REVIEW_BADGE_TIERS } from '../constants/place-review-badge-tiers'
import { PlaceBadgeProgressItemDto } from '../../infrastructure/http/dtos'

export class ListUserBadgeProgress {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(userId: string): Promise<PlaceBadgeProgressItemDto[]> {
    const placeReviewCounts = await this.placeReviewRepo.listReviewCountsByUserGroupedByPlace(userId)

    return placeReviewCounts
      .map((placeReviewCount) => {
        const nextTier = PLACE_REVIEW_BADGE_TIERS.find((tierConfig) => placeReviewCount.reviewCount < tierConfig.minReviews)
        if (!nextTier) return null

        return {
          placeId: placeReviewCount.placeId,
          placeName: placeReviewCount.placeName,
          brandAvatar: placeReviewCount.brandAvatar,
          reviewCount: placeReviewCount.reviewCount,
          targetReviewCount: nextTier.minReviews,
          tier: nextTier.tier,
          label: nextTier.label
        }
      })
      .filter((badgeProgress): badgeProgress is PlaceBadgeProgressItemDto => badgeProgress !== null)
      .sort((a, b) => {
        const aRemainingReviews = a.targetReviewCount - a.reviewCount
        const bRemainingReviews = b.targetReviewCount - b.reviewCount
        if (aRemainingReviews !== bRemainingReviews) return aRemainingReviews - bRemainingReviews
        return b.reviewCount - a.reviewCount
      })
  }
}
