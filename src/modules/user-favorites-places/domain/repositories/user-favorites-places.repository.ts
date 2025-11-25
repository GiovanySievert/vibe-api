import { UserFavoritesPlaces } from '../mappers'

export interface UserFavoritesPlacesRepository {
  create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces>
  delete(data: UserFavoritesPlaces): Promise<void>
  list(userId: string): Promise<any>
}
