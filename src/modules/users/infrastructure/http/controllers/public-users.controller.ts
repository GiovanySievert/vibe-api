import { User } from 'better-auth/types'
import { GetPublicUserById, GetPublicUserByUsername, GetUserSuggestions, GetTrendingUsers } from '@src/modules/users/application/use-cases'
import { GetPublicUserByIdDto, GetPublicUserByUsernameDto, GetUserSuggestionsDto, GetTrendingUsersDto } from '../dto'
import { UserNotFoundException } from '@src/modules/users/domain/exceptions'

export class PublicUsersController {
  constructor(
    private readonly getPublicUserById: GetPublicUserById,
    private readonly getPublicUserByUsername: GetPublicUserByUsername,
    private readonly getUserSuggestions: GetUserSuggestions,
    private readonly getTrendingUsersUseCase: GetTrendingUsers
  ) {}

  async getById({ params, user }: { params: { userId: string }; user: User }) {
    const publicUser = await this.getPublicUserById.execute(params.userId, user.id)

    if (!publicUser) {
      throw new UserNotFoundException()
    }

    return GetPublicUserByIdDto.fromData(publicUser)
  }

  async getByUsername({ params, user }: { params: { username: string }; user: User }) {
    const publicUser = await this.getPublicUserByUsername.execute(params.username, user.id)
    return GetPublicUserByUsernameDto.fromArray(publicUser)
  }

  async getSuggestions({ user }: { user: User }) {
    const suggestions = await this.getUserSuggestions.execute(user.id)
    return GetUserSuggestionsDto.fromArray(suggestions)
  }

  async getTrending({ user }: { user: User }) {
    const trending = await this.getTrendingUsersUseCase.execute(user.id)
    return GetTrendingUsersDto.fromArray(trending)
  }
}
