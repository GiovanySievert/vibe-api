import { FollowRequestQueryResult } from './follow-request-query-result.dto'

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
  static from(data: FollowRequestQueryResult): GetFollowRequestByUserDto {
    return {
      id: data.followRequests.id,
      requesterId: data.followRequests.requesterId,
      requesterUsername: data.users.username,
      requesterAvatar: '',
      requestedId: data.followRequests.requestedId,
      status: data.followRequests.status as 'pending' | 'accepted' | 'rejected',
      createdAt: data.followRequests.createdAt.toISOString()
    }
  }

  static fromArray(data: FollowRequestQueryResult[]): GetFollowRequestByUserDto[] {
    return data.map((item) => this.from(item))
  }
}
