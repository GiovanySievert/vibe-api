import { FollowRequests } from '../../../domain/mappers'
import { FollowRequestsRepository } from '../../../domain/repositories'

export interface CreateFollowRequestData {
  requestedId: string
  requesterId: string
  status?: string
}

export class CreateFollowRequest {
  constructor(private readonly followRequest: FollowRequestsRepository) {}

  async execute(data: CreateFollowRequestData): Promise<FollowRequests> {
    const followerRequest = await this.followRequest.create({
      requestedId: data.requestedId,
      requesterId: data.requesterId,
      status: data.status
    })
    return followerRequest
  }
}
