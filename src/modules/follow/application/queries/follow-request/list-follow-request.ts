import { FollowRequests } from '@src/modules/follow/domain/mappers'
import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'

export class ListFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(userId: string): Promise<FollowRequests[]> {
    const followerRequests = await this.followRequest.list(userId)
    return followerRequests
  }
}
