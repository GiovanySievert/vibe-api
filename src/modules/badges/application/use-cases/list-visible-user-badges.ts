import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import { tiersAchievedFor } from '../constants/place-review-badge-tiers'
import { PlaceBadgeListItemDto } from '../../infrastructure/http/dtos'
import { buildUserBadgeListFromBadgeRecords } from './build-user-badge-list'

export class ListVisibleUserBadges {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(userId: string): Promise<PlaceBadgeListItemDto[]> {
    const selectedPlaceReviewCounts = await this.placeReviewRepo.listSelectedReviewCountsByUserGroupedByPlace(userId)
    const visibleBadgeAchievementRecords = selectedPlaceReviewCounts.flatMap((selectedPlaceReviewCount) =>
      tiersAchievedFor(selectedPlaceReviewCount.reviewCount).map((tierConfig) => ({
        userId,
        placeId: selectedPlaceReviewCount.placeId,
        tier: tierConfig.tier,
        achievedAt: selectedPlaceReviewCount.latestReviewAt,
        reviewCount: selectedPlaceReviewCount.reviewCount,
        profilePosition: selectedPlaceReviewCount.profilePosition,
        place: {
          id: selectedPlaceReviewCount.placeId,
          name: selectedPlaceReviewCount.placeName,
          brandAvatar: selectedPlaceReviewCount.brandAvatar
        }
      }))
    )
    const visibleBadgeSummaries = await buildUserBadgeListFromBadgeRecords(visibleBadgeAchievementRecords)

    return visibleBadgeSummaries.sort((a, b) => (a.profilePosition ?? 0) - (b.profilePosition ?? 0))
  }
}
