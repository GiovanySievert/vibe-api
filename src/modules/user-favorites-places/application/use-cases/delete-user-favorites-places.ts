import { UserFavoritesPlacesRepository } from '../../domain/repositories'

export interface DeleteUserFavoritesPlacesData {
  userId: string
  placeId: string
}

export class DeleteUserFavoritesPlaces {
  constructor(private readonly userFavoritesPlaces: UserFavoritesPlacesRepository) {}

  async execute(data: DeleteUserFavoritesPlacesData): Promise<void> {
    return await this.userFavoritesPlaces.delete(data)
  }
}
