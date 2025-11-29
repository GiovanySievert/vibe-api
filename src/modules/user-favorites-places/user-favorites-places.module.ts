import {
  CreateUserFavoritesPlaces,
  GetUserFavoritesPlace,
  DeleteUserFavoritesPlaces
} from './application/queries'
import { DrizzleUserFavoritesPlacesRepository } from './infrastructure/persistence'
import { UserFavoritesController } from './http/controllers/user-favorites-places.controller'

export class UserFavoritesPlacesModule {
  public readonly controller: UserFavoritesController

  constructor() {
    const userFavoritesPlacesRepo = new DrizzleUserFavoritesPlacesRepository()

    const getUserFavoritesPlacesService = new GetUserFavoritesPlace(userFavoritesPlacesRepo)
    const createUserFavoritesPlacesService = new CreateUserFavoritesPlaces(userFavoritesPlacesRepo)
    const deleteUserFavoritesPlacesService = new DeleteUserFavoritesPlaces(userFavoritesPlacesRepo)

    this.controller = new UserFavoritesController(
      getUserFavoritesPlacesService,
      createUserFavoritesPlacesService,
      deleteUserFavoritesPlacesService
    )
  }
}
