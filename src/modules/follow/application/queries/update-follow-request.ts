import { FollowRequests } from '../../domain/mappers'
import { FollowRequestsRepository } from '../../domain/repositories'
import { UpdateFollowRequestDto } from '../../http/dtos'

export class UpdateFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(requestFollowId: string, data: UpdateFollowRequestDto): Promise<FollowRequests> {
    const followerRequest = await this.followRequest.update(requestFollowId, data.status)
    return followerRequest
  }
}
