import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class GetPublicUserByIdDto {
  id: string
  name: string
  username: string
  image?: string

  constructor(data: Users) {
    this.id = data.id
    this.name = data.name
    this.username = data.username
    this.image = data.image || ''
  }

  static fromData(data: Users) {
    return {
      id: data.id,
      username: data.username,
      image: data.image
    }
  }
}
