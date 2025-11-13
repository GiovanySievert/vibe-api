import { UserFavoritesPlaces } from '../mappers'

export interface UserFavoritesPlacesRepository {
  create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces>
  list(userId: string): Promise<any>
  // delete(data: any): Promise<void>
}
