import {
  GetPublicUserById,
  GetPublicUserByUsername,
  GetUserSuggestions,
  GetTrendingUsers
} from './application/use-cases'
import { DrizzlePublicUserRepository } from './infrastructure/persistence'
import { PublicUsersController } from './infrastructure/http/controllers/public-users.controller'

export class UsersModule {
  public readonly controller: PublicUsersController

  constructor() {
    const publicUserRepo = new DrizzlePublicUserRepository()

    const getPublicUserByIdService = new GetPublicUserById(publicUserRepo)
    const getPublicUserByUsernameService = new GetPublicUserByUsername(publicUserRepo)
    const getUserSuggestionsService = new GetUserSuggestions(publicUserRepo)
    const getTrendingUsersService = new GetTrendingUsers(publicUserRepo)

    this.controller = new PublicUsersController(
      getPublicUserByIdService,
      getPublicUserByUsernameService,
      getUserSuggestionsService,
      getTrendingUsersService
    )
  }
}
