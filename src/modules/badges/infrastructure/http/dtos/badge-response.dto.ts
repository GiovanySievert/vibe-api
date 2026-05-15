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
  visibleOnProfile: boolean
  profilePosition: number | null
  tiers: PlaceBadgeTierEntryDto[]
}

export interface PlaceBadgeForPlaceDto {
  userId: string
  placeId: string
  reviewCount: number
  tiers: PlaceBadgeTierEntryDto[]
}

export interface PlaceBadgeProgressItemDto {
  placeId: string
  placeName: string | null
  brandAvatar: string | null
  reviewCount: number
  targetReviewCount: number
  tier: PlaceReviewBadgeTier
  label: string
}

export interface UpdateProfileBadgeSelectionDto {
  placeIds: string[]
}
