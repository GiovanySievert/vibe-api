import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories'

export interface CreateUserFavoritesPlacesData {
  userId: string
  placeId: string
}

export class CreateUserFavoritesPlaces {
  constructor(private readonly userFavoritesPlaces: UserFavoritesPlacesRepository) {}

  async execute(data: CreateUserFavoritesPlacesData): Promise<UserFavoritesPlaces> {
    const userFavoritesPlaces = await this.userFavoritesPlaces.create(data)
    return userFavoritesPlaces
  }
}
