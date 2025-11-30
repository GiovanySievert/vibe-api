import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { GetFollowRequestByUserDtoMapper } from '@src/modules/follow/infrastructure/http/dtos'

export class ListFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(userId: string): Promise<GetFollowRequestByUserDtoMapper[]> {
    const followerRequests = await this.followRequest.list(userId)
    return followerRequests
  }
}
