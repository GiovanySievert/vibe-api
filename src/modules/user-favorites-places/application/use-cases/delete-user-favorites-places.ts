import { UserFavoritesPlacesRepository } from '../../domain/repositories'

export class DeleteUserFavoritesPlaces {
  constructor(private readonly userFavoritesPlaces: UserFavoritesPlacesRepository) {}

  async execute(data: any): Promise<void> {
    return await this.userFavoritesPlaces.delete(data)
  }
}
