import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { GetFollowRequestByUserDtoMapper } from '@src/modules/follow/infrastructure/http/dtos'
import { FollowRequestListType } from '@src/modules/follow/domain/types'

export class ListRequestedFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(userId: string): Promise<GetFollowRequestByUserDtoMapper[]> {
    const followerRequests = await this.followRequest.listByType(FollowRequestListType.SENT, userId)
    return followerRequests
  }
}
