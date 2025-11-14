export class ListUserFollowResponseDto {
  id: string
  userId: string
  username: string
  image: string | null

  constructor(data: any) {
    this.id = data.id
    this.userId = data.userId
    this.username = data.username
    this.image = data.image
  }

  static fromArray(data: any[]) {
    return data.map((item) => ({
      id: item.id,
      userId: item.userId,
      username: item.username,
      image: item.image
    }))
  }
}
