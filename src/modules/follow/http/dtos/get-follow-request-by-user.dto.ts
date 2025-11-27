export interface GetFollowRequestByUserDto {
  id: string
  requesterId: string
  requesterUsername: string
  requesterAvatar: string
  requestedId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export class GetFollowRequestByUserDtoMapper {
  static from(data: any): GetFollowRequestByUserDto {
    return {
      id: data.followRequests.id,
      requesterId: data.followRequests.requesterId,
      requesterUsername: data.users.username,
      requesterAvatar: data.users.avatar,
      requestedId: data.followRequests.requestedId,
      status: data.followRequests.status,
      createdAt: data.followRequests.createdAt
    }
  }

  static fromArray(data: any[]): GetFollowRequestByUserDto[] {
    return data.map((item) => this.from(item))
  }
}
