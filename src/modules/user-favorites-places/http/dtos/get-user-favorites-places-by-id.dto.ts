import { UserFavoritesPlacesQueryResult } from './user-favorites-places-query-result.dto'

export class GetUserFavoritesPlacesByIdDto {
  id: string
  placeId: string
  name: string
  createdAt: Date
  avatar: string

  constructor(data: UserFavoritesPlacesQueryResult) {
    this.id = data.user_favorites_places.id
    this.placeId = data.user_favorites_places.placeId
    this.name = data.places?.name || ''
    this.createdAt = data.user_favorites_places.createdAt
    this.avatar = data.brand?.avatar || ''
  }

  static fromArray(data: UserFavoritesPlacesQueryResult[]): GetUserFavoritesPlacesByIdDto[] {
    return data.map((item) => new GetUserFavoritesPlacesByIdDto(item))
  }
}
