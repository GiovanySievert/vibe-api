import { FollowRequests } from '../../domain/mappers'
import { FollowRequestsRepository } from '../../domain/repositories'

export class ListFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(userId: string): Promise<FollowRequests[]> {
    const followerRequests = await this.followRequest.listByUser(userId)
    return followerRequests
  }
}
