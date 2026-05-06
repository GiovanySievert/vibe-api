import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import { labelFor, PLACE_REVIEW_BADGE_TIERS } from '../constants/place-review-badge-tiers'
import { UserPlaceBadgesRepository } from '../../domain/repositories'
import { PlaceBadgeListItemDto, PlaceBadgeTierEntryDto } from '../../infrastructure/http/dtos'

export class ListUserBadges {
  constructor(
    private readonly userPlaceBadgesRepo: UserPlaceBadgesRepository,
    private readonly placeReviewRepo: PlaceReviewRepository
  ) {}

  async execute(userId: string): Promise<PlaceBadgeListItemDto[]> {
    const rows = await this.userPlaceBadgesRepo.listByUser(userId)
    if (rows.length === 0) return []

    const grouped = new Map<string, PlaceBadgeListItemDto>()

    for (const row of rows) {
      const entry: PlaceBadgeTierEntryDto = {
        tier: row.tier,
        label: labelFor(row.tier),
        achievedAt: row.achievedAt
      }

      const existing = grouped.get(row.placeId)
      if (existing) {
        existing.tiers.push(entry)
        continue
      }

      grouped.set(row.placeId, {
        placeId: row.placeId,
        placeName: row.place.name,
        brandAvatar: row.place.brandAvatar,
        tiers: [entry],
        reviewCount: 0
      })
    }

    const placeIds = [...grouped.keys()]
    const counts = await Promise.all(
      placeIds.map(async (placeId) => ({
        placeId,
        count: await this.placeReviewRepo.countReviewsByUserAndPlace(userId, placeId)
      }))
    )

    for (const { placeId, count } of counts) {
      const item = grouped.get(placeId)
      if (item) item.reviewCount = count
    }

    const tierOrder = new Map(PLACE_REVIEW_BADGE_TIERS.map((t, i) => [t.tier, i]))

    for (const item of grouped.values()) {
      item.tiers.sort((a, b) => (tierOrder.get(a.tier) ?? 0) - (tierOrder.get(b.tier) ?? 0))
    }

    return [...grouped.values()].sort((a, b) => b.reviewCount - a.reviewCount)
  }
}
