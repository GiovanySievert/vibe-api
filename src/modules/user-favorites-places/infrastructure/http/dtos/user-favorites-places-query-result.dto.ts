export interface UserFavoritesPlacesQueryResult {
  user_favorites_places: {
    id: string
    placeId: string
    createdAt: Date
  }
  places: {
    id: string
    name: string
  } | null
  brand: {
    id: string
    avatar: string | null
  } | null
}
