import type { PlaceReviewBadgeTier } from '../../domain/types'

export interface BadgeTierConfig {
  tier: PlaceReviewBadgeTier
  minReviews: number
  label: string
}

export const PLACE_REVIEW_BADGE_TIERS: readonly BadgeTierConfig[] = [
  { tier: 'regular', minReviews: 3, label: 'cliente' },
  { tier: 'fan', minReviews: 5, label: 'fã' },
  { tier: 'frequent', minReviews: 10, label: 'VIP' },
  { tier: 'legend', minReviews: 15, label: 'lenda' },
  { tier: 'king', minReviews: 20, label: 'rei' }
] as const

export function tiersAchievedFor(reviewCount: number): readonly BadgeTierConfig[] {
  return PLACE_REVIEW_BADGE_TIERS.filter((t) => reviewCount >= t.minReviews)
}

export function highestTierFor(reviewCount: number): BadgeTierConfig | null {
  const achieved = tiersAchievedFor(reviewCount)
  return achieved.length ? achieved[achieved.length - 1] : null
}

export function labelFor(tier: PlaceReviewBadgeTier): string {
  return PLACE_REVIEW_BADGE_TIERS.find((t) => t.tier === tier)?.label ?? tier
}
