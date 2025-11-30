import { UserFavoritesPlaces } from '../mappers'
import { GetUserFavoritesPlacesByIdDto } from '../../infrastructure/http/dtos'

export interface UserFavoritesPlacesRepository {
  create(data: Omit<UserFavoritesPlaces, 'id' | 'createdAt'>): Promise<UserFavoritesPlaces>
  delete(data: Pick<UserFavoritesPlaces, 'userId' | 'placeId'>): Promise<void>
  list(userId: string): Promise<GetUserFavoritesPlacesByIdDto[]>
}
