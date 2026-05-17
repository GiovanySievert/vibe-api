import { PublicUserProfile } from '@src/modules/users/domain/repositories'

export class GetPublicUserByIdDto {
  id: string
  name: string
  username: string
  image?: string

  constructor(data: PublicUserProfile) {
    this.id = data.id
    this.name = data.name
    this.username = data.username
    this.image = data.image || ''
  }

  static fromData(data: PublicUserProfile) {
    return {
      id: data.id,
      username: data.username,
      image: data.image,
      bio: data.bio ?? null
    }
  }
}
