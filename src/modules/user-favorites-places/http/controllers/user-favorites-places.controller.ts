import { CreateUserFavoritesPlaces, GetUserFavoritesPlace, DeleteUserFavoritesPlaces } from '../../application/queries'

import { User } from 'better-auth/types'

export class UserFavoritesController {
  constructor(
    private readonly getUserFavoritesPlaces: GetUserFavoritesPlace,
    private readonly createUserFavoritesPlaces: CreateUserFavoritesPlaces,
    private readonly deleteUserFavoritesPlaces: DeleteUserFavoritesPlaces
  ) {}

  async list({ user }: { user: User }) {
    return await this.getUserFavoritesPlaces.execute(user.id)
  }

  async create({ params, user }: { params: { placeId: string }; user: User }) {
    return await this.createUserFavoritesPlaces.execute({
      userId: user.id,
      venueId: params.placeId
    })
  }

  async delete({ params, user }: { params: { placeId: string }; user: User }) {
    return await this.deleteUserFavoritesPlaces.execute({
      userId: user.id,
      venueId: params.placeId
    })
  }
}
