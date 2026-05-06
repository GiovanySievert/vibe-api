import { PlaceReviewBadgeTier } from '../../../domain/types'

export interface PlaceBadgeTierEntryDto {
  tier: PlaceReviewBadgeTier
  label: string
  achievedAt: Date
}

export interface PlaceBadgeListItemDto {
  placeId: string
  placeName: string | null
  brandAvatar: string | null
  reviewCount: number
  tiers: PlaceBadgeTierEntryDto[]
}

export interface PlaceBadgeForPlaceDto {
  userId: string
  placeId: string
  reviewCount: number
  tiers: PlaceBadgeTierEntryDto[]
}
