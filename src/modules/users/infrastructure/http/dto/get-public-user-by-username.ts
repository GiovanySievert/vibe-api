import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class GetPublicUserByUsernameDto {
  id: string
  username: string
  image: string

  constructor(data: Users) {
    this.id = data.id
    this.username = data.username
    this.image = data.image || ''
  }

  static fromArray(data: Users[]) {
    return data.map((item) => ({
      id: item.id,
      username: item.username,
      image: item.image
    }))
  }
}
