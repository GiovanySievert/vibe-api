import { User } from 'better-auth/types'

import { GetPublicUserById, GetPublicUserByUsername } from '@src/modules/user/application/queries'
import { GetPublicUserByIdDto, GetPublicUserByUsernameDto } from '../dto'

export class PublicUsersController {
  constructor(
    private readonly getPublicUserById: GetPublicUserById,
    private readonly getPublicUserByUsername: GetPublicUserByUsername
  ) {}

  async getById({ params }: { params: { userId: string } }) {
    const publicUser = await this.getPublicUserById.execute(params.userId)

    return new GetPublicUserByIdDto(publicUser)
  }

  async getByUsername({ params }: { params: { username: string } }) {
    const publicUser = await this.getPublicUserByUsername.execute(params.username)
    return GetPublicUserByUsernameDto.fromArray(publicUser)
  }
}
