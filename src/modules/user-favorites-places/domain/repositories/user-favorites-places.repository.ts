import { UserFavoritesPlaces } from '../mappers'

export interface UserFavoritesPlacesRepository {
  create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces>
  getByUser(userId: number): Promise<any>
  // delete(data: any): Promise<void>
}
