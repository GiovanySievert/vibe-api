import { FollowRequestQueryResult } from './follow-request-query-result.dto'

export interface GetFollowRequestByUserDto {
  id: string
  userId: string
  username: string
  avatar: string | null
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export class GetFollowRequestByUserDtoMapper {
  static from(data: FollowRequestQueryResult): GetFollowRequestByUserDto {
    return {
      id: data.followRequests.id,
      userId: data.users.id,
      username: data.users.username,
      avatar: data.users.avatar || null,
      status: data.followRequests.status as 'pending' | 'accepted' | 'rejected',
      createdAt: data.followRequests.createdAt.toISOString()
    }
  }

  static fromArray(data: FollowRequestQueryResult[]): GetFollowRequestByUserDto[] {
    return data.map((item) => this.from(item))
  }
}
