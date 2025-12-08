import { User } from 'better-auth/types'
import { GetPublicUserById, GetPublicUserByUsername } from '@src/modules/users/application/use-cases'
import { GetPublicUserByIdDto, GetPublicUserByUsernameDto } from '../dto'
import { UserNotFoundException } from '@src/modules/users/domain/exceptions'

export class PublicUsersController {
  constructor(
    private readonly getPublicUserById: GetPublicUserById,
    private readonly getPublicUserByUsername: GetPublicUserByUsername
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
}
