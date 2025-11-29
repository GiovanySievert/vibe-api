import { User } from 'better-auth/types'
import { GetPublicUserById, GetPublicUserByUsername } from '@src/modules/users/application/queries'
import { GetPublicUserByIdDto, GetPublicUserByUsernameDto } from '../dto'
import { appLogger } from '@src/config/logger'

export class PublicUsersController {
  constructor(
    private readonly getPublicUserById: GetPublicUserById,
    private readonly getPublicUserByUsername: GetPublicUserByUsername
  ) {}

  async getById({ params }: { params: { userId: string } }) {
    try {
      const publicUser = await this.getPublicUserById.execute(params.userId)
      return GetPublicUserByIdDto.fromData(publicUser)
    } catch (error) {
      appLogger.error('Failed to get public user by id', {
        userId: params.userId,
        error
      })
      throw error
    }
  }

  async getByUsername({ params, user }: { params: { username: string }; user: User }) {
    try {
      const publicUser = await this.getPublicUserByUsername.execute(params.username, user.id)
      return GetPublicUserByUsernameDto.fromArray(publicUser)
    } catch (error) {
      appLogger.error('Failed to get public user by username', {
        username: params.username,
        requesterId: user.id,
        error
      })
      throw error
    }
  }
}
