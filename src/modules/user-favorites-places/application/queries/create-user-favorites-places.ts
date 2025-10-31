import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories'

export class CreateUserFavoritesPlaces {
  constructor(private readonly userFavoritesPlaces: UserFavoritesPlacesRepository) {}

  async execute(data: any): Promise<UserFavoritesPlaces> {
    const userFavoritesPlaces = await this.userFavoritesPlaces.create(data)
    return userFavoritesPlaces
  }
}
