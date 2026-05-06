import { UserPlaceBadge } from '../mappers'
import { PlaceReviewBadgeTier } from '../types'

export interface UpsertUserPlaceBadgeInput {
  userId: string
  placeId: string
  tier: PlaceReviewBadgeTier
}

export interface RemoveUserPlaceBadgeTiersInput {
  userId: string
  placeId: string
  tiers: PlaceReviewBadgeTier[]
}

export interface UserPlaceBadgeWithPlace extends UserPlaceBadge {
  place: {
    id: string
    name: string | null
    brandAvatar: string | null
  }
}

export interface UserPlaceBadgesRepository {
  upsertTier(input: UpsertUserPlaceBadgeInput): Promise<UserPlaceBadge>
  removeTiers(input: RemoveUserPlaceBadgeTiersInput): Promise<void>
  getByUserAndPlace(userId: string, placeId: string): Promise<UserPlaceBadge[]>
  listByUser(userId: string): Promise<UserPlaceBadgeWithPlace[]>
}
