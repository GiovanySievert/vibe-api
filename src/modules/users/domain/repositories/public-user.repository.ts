import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export type UserSuggestion = {
  id: string
  username: string
  image: string | null
  mutualCount: number
}

export type TrendingUser = {
  id: string
  username: string
  image: string | null
  reviewsCount: number
}

export interface PublicUserRepository {
  getUserById(userId: string, loggedUserId: string): Promise<Users | null>
  getUserByUsername(username: string, userIdToExclude: string): Promise<Users[]>
  getSuggestions(userId: string, limit?: number): Promise<UserSuggestion[]>
  getTrending(userId: string, limit?: number): Promise<TrendingUser[]>
}
