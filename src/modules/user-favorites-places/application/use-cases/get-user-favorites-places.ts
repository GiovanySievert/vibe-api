import { GetUserFavoritesPlacesByIdDto } from '../../infrastructure/http/dtos'
import { UserFavoritesPlacesRepository } from '../../domain/repositories'

export class GetUserFavoritesPlace {
  constructor(private readonly userFavoritesPlaces: UserFavoritesPlacesRepository) {}

  async execute(userId: string): Promise<GetUserFavoritesPlacesByIdDto[]> {
    const userFavoritesPlaces = await this.userFavoritesPlaces.list(userId)
    return userFavoritesPlaces
  }
}
