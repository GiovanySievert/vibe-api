import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories'

export class GetUserFavoritesPlace {
  constructor(private readonly userFavoritesPlaces: UserFavoritesPlacesRepository) {}

  async execute(userId: number): Promise<UserFavoritesPlaces> {
    const userFavoritesPlaces = await this.userFavoritesPlaces.getByUser(userId)
    return userFavoritesPlaces
  }
}
