export type UserSuggestion = {
  id: string
  username: string
  image: string | null
  imageThumbnail: string | null
  mutualCount: number
}

export type TrendingUser = {
  id: string
  username: string
  image: string | null
  imageThumbnail: string | null
  reviewsCount: number
}

export type WeekRef = { isoYear: number; isoWeek: number }

export type PublicUserProfile = {
  id: string
  name: string
  username: string
  image: string | null
  imageThumbnail: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PublicUserRepository {
  getUserById(userId: string, loggedUserId: string): Promise<PublicUserProfile | null>
  getUserByUsername(username: string, userIdToExclude: string): Promise<PublicUserProfile[]>
  getSuggestions(userId: string, limit?: number): Promise<UserSuggestion[]>
  getTrending(userId: string, weeks: WeekRef[], limit?: number): Promise<TrendingUser[]>
}
