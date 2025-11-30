import { CreateUserFavoritesPlaces, GetUserFavoritesPlace, DeleteUserFavoritesPlaces } from '../../../application/use-cases'
import { User } from 'better-auth/types'
import { appLogger } from '@src/config/logger'

export class UserFavoritesController {
  constructor(
    private readonly getUserFavoritesPlaces: GetUserFavoritesPlace,
    private readonly createUserFavoritesPlaces: CreateUserFavoritesPlaces,
    private readonly deleteUserFavoritesPlaces: DeleteUserFavoritesPlaces
  ) {}

  async list({ user }: { user: User }) {
    try {
      return await this.getUserFavoritesPlaces.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to list user favorite places', {
        userId: user.id,
        error
      })
      throw error
    }
  }

  async create({ params, user }: { params: { placeId: string }; user: User }) {
    try {
      return await this.createUserFavoritesPlaces.execute({
        userId: user.id,
        placeId: params.placeId
      })
    } catch (error) {
      appLogger.error('Failed to create favorite place', {
        userId: user.id,
        placeId: params.placeId,
        error
      })
      throw error
    }
  }

  async delete({ params, user }: { params: { placeId: string }; user: User }) {
    try {
      return await this.deleteUserFavoritesPlaces.execute({
        userId: user.id,
        placeId: params.placeId
      })
    } catch (error) {
      appLogger.error('Failed to delete favorite place', {
        userId: user.id,
        placeId: params.placeId,
        error
      })
      throw error
    }
  }
}
