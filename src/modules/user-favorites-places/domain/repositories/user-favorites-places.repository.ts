import { UserFavoritesPlaces } from '../mappers'

export interface UserFavoritesPlacesRepository {
  create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces>
  getByUser(userId: string): Promise<any>
  // delete(data: any): Promise<void>
}
