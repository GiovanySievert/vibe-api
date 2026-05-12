import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { GetFollowRequestByUserDtoMapper } from '@src/modules/follow/infrastructure/http/dtos'
import { FollowRequestListType } from '@src/modules/follow/domain/types'

export class ListFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(userId: string, page?: number, limit?: number): Promise<GetFollowRequestByUserDtoMapper[]> {
    const followerRequests = await this.followRequest.listByType(FollowRequestListType.RECEIVED, userId, page, limit)
    return followerRequests
  }
}
