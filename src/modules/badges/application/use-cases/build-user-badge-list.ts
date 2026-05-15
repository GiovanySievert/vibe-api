import { labelFor, PLACE_REVIEW_BADGE_TIERS } from '../constants/place-review-badge-tiers'
import { UserPlaceBadgeWithPlace } from '../../domain/repositories'
import { PlaceBadgeListItemDto, PlaceBadgeTierEntryDto } from '../../infrastructure/http/dtos'

export type BadgeAchievementRecord = Pick<UserPlaceBadgeWithPlace, 'userId' | 'placeId' | 'tier' | 'achievedAt' | 'place'> & {
  reviewCount: number
  profilePosition?: number | null
}

export async function buildUserBadgeListFromBadgeRecords(
  badgeRecords: BadgeAchievementRecord[]
): Promise<PlaceBadgeListItemDto[]> {
  if (badgeRecords.length === 0) return []

  const badgeSummaryByPlaceId = new Map<string, PlaceBadgeListItemDto>()

  for (const badgeRecord of badgeRecords) {
    const profilePosition = badgeRecord.profilePosition ?? null
    const entry: PlaceBadgeTierEntryDto = {
      tier: badgeRecord.tier,
      label: labelFor(badgeRecord.tier),
      achievedAt: badgeRecord.achievedAt
    }

    const badgeSummary = badgeSummaryByPlaceId.get(badgeRecord.placeId)
    if (badgeSummary) {
      badgeSummary.tiers.push(entry)
      continue
    }

    badgeSummaryByPlaceId.set(badgeRecord.placeId, {
      placeId: badgeRecord.placeId,
      placeName: badgeRecord.place.name,
      brandAvatar: badgeRecord.place.brandAvatar,
      tiers: [entry],
      reviewCount: badgeRecord.reviewCount,
      visibleOnProfile: profilePosition !== null,
      profilePosition
    })
  }

  const tierOrder = new Map(PLACE_REVIEW_BADGE_TIERS.map((t, i) => [t.tier, i]))

  for (const badgeSummary of badgeSummaryByPlaceId.values()) {
    badgeSummary.tiers.sort((a, b) => (tierOrder.get(a.tier) ?? 0) - (tierOrder.get(b.tier) ?? 0))
  }

  return [...badgeSummaryByPlaceId.values()]
}
