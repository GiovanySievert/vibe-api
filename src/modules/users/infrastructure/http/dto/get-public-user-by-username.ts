import { PublicUserProfile } from '@src/modules/users/domain/repositories'

export class GetPublicUserByUsernameDto {
  id: string
  username: string
  image: string
  imageThumbnail: string

  constructor(data: PublicUserProfile) {
    this.id = data.id
    this.username = data.username
    this.image = data.image || ''
    this.imageThumbnail = data.imageThumbnail || ''
  }

  static fromArray(data: PublicUserProfile[]) {
    return data.map((item) => ({
      id: item.id,
      username: item.username,
      image: item.image,
      imageThumbnail: item.imageThumbnail
    }))
  }
}
