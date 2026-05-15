import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import { tiersAchievedFor } from '../constants/place-review-badge-tiers'
import { UserPlaceBadgesRepository, UserProfileBadgesRepository } from '../../domain/repositories'
import { PlaceBadgeListItemDto } from '../../infrastructure/http/dtos'
import { buildUserBadgeListFromBadgeRecords } from './build-user-badge-list'

export class ListUserBadges {
  constructor(
    private readonly userPlaceBadgesRepo: UserPlaceBadgesRepository,
    private readonly userProfileBadgesRepo: UserProfileBadgesRepository,
    private readonly placeReviewRepo: PlaceReviewRepository
  ) {}

  async execute(userId: string): Promise<PlaceBadgeListItemDto[]> {
    const [persistedBadgeRecords, profileBadgeSelections, placeReviewCounts] = await Promise.all([
      this.userPlaceBadgesRepo.listByUser(userId),
      this.userProfileBadgesRepo.listByUser(userId),
      this.placeReviewRepo.listReviewCountsByUserGroupedByPlace(userId)
    ])
    const profileBadgeSelectionByPlaceId = new Map(
      profileBadgeSelections.map((profileBadgeSelection) => [profileBadgeSelection.placeId, profileBadgeSelection])
    )
    const persistedBadgeRecordByPlaceAndTier = new Map(
      persistedBadgeRecords.map((badgeRecord) => [`${badgeRecord.placeId}:${badgeRecord.tier}`, badgeRecord])
    )
    const badgeAchievementRecords = placeReviewCounts.flatMap((placeReviewCount) =>
      tiersAchievedFor(placeReviewCount.reviewCount).map((tierConfig) => {
        const persistedBadgeRecord = persistedBadgeRecordByPlaceAndTier.get(`${placeReviewCount.placeId}:${tierConfig.tier}`)

        return {
          userId,
          placeId: placeReviewCount.placeId,
          tier: tierConfig.tier,
          achievedAt: persistedBadgeRecord?.achievedAt ?? placeReviewCount.latestReviewAt,
          reviewCount: placeReviewCount.reviewCount,
          profilePosition: profileBadgeSelectionByPlaceId.get(placeReviewCount.placeId)?.position ?? null,
          place: {
            id: placeReviewCount.placeId,
            name: placeReviewCount.placeName,
            brandAvatar: placeReviewCount.brandAvatar
          }
        }
      })
    )

    const badgeSummaries = await buildUserBadgeListFromBadgeRecords(badgeAchievementRecords)

    return badgeSummaries.sort((a, b) => b.reviewCount - a.reviewCount)
  }
}
