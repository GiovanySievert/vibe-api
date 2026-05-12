import { UserFollowData } from './user-follow-data.dto'

export class ListUserFollowResponseDto {
  id: string
  userId: string
  username: string
  name: string
  image: string | null

  constructor(data: UserFollowData) {
    this.id = data.id
    this.userId = data.userId
    this.username = data.username
    this.name = data.name
    this.image = data.image
  }

  static fromArray(data: UserFollowData[]) {
    return data.map((item) => ({
      id: item.id,
      userId: item.userId,
      username: item.username,
      name: item.name,
      image: item.image
    }))
  }
}
