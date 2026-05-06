import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import { labelFor, PLACE_REVIEW_BADGE_TIERS } from '../constants/place-review-badge-tiers'
import { UserPlaceBadgesRepository } from '../../domain/repositories'
import { PlaceBadgeForPlaceDto, PlaceBadgeTierEntryDto } from '../../infrastructure/http/dtos'

export class GetUserBadgeForPlace {
  constructor(
    private readonly userPlaceBadgesRepo: UserPlaceBadgesRepository,
    private readonly placeReviewRepo: PlaceReviewRepository
  ) {}

  async execute(userId: string, placeId: string): Promise<PlaceBadgeForPlaceDto> {
    const [badges, reviewCount] = await Promise.all([
      this.userPlaceBadgesRepo.getByUserAndPlace(userId, placeId),
      this.placeReviewRepo.countReviewsByUserAndPlace(userId, placeId)
    ])

    const tierOrder = new Map(PLACE_REVIEW_BADGE_TIERS.map((t, i) => [t.tier, i]))

    const tiers: PlaceBadgeTierEntryDto[] = badges
      .map((b) => ({
        tier: b.tier,
        label: labelFor(b.tier),
        achievedAt: b.achievedAt
      }))
      .sort((a, b) => (tierOrder.get(a.tier) ?? 0) - (tierOrder.get(b.tier) ?? 0))

    return {
      userId,
      placeId,
      reviewCount,
      tiers
    }
  }
}
