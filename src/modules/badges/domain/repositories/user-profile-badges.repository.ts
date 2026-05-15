import { UserProfileBadge } from '../mappers'

export interface ReplaceUserProfileBadgesInput {
  userId: string
  placeIds: string[]
}

export interface UserProfileBadgesRepository {
  listByUser(userId: string): Promise<UserProfileBadge[]>
  replaceForUser(input: ReplaceUserProfileBadgesInput): Promise<UserProfileBadge[]>
  removeByUserAndPlace(userId: string, placeId: string): Promise<void>
}
