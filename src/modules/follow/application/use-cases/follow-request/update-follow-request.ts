import { FollowRequests } from '@src/modules/follow/domain/mappers'
import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { UpdateFollowRequestDto } from '@src/modules/follow/http/dtos'

export class UpdateFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(requestFollowId: string, data: UpdateFollowRequestDto): Promise<FollowRequests> {
    const followerRequest = await this.followRequest.update(requestFollowId, data.status)
    return followerRequest
  }
}
