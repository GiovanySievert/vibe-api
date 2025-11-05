export class GetFollowRequestByUser {
  id: string
  venueId: string
  name: string
  createdAt: Date
  avatar: string

  constructor(data: any) {
    this.id = data.user_favorites_places.id
    this.venueId = data.user_favorites_places.venueId
    this.name = data.venues?.name || ''
    this.createdAt = data.user_favorites_places.createdAt
    this.avatar = data.brand.avatar
  }

  static fromArray(data: any[]): GetFollowRequestByUser[] {
    return data.map((item) => new GetFollowRequestByUser(item))
  }
}
