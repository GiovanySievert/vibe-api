import { PublicUserProfile } from '@src/modules/users/domain/repositories'

export class GetPublicUserByIdDto {
  id: string
  name: string
  username: string
  image?: string
  imageThumbnail?: string

  constructor(data: PublicUserProfile) {
    this.id = data.id
    this.name = data.name
    this.username = data.username
    this.image = data.image || ''
    this.imageThumbnail = data.imageThumbnail || ''
  }

  static fromData(data: PublicUserProfile) {
    return {
      id: data.id,
      username: data.username,
      image: data.image,
      imageThumbnail: data.imageThumbnail,
      bio: data.bio ?? null
    }
  }
}
