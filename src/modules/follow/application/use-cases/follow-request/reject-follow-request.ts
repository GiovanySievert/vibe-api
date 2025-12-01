import { UpdateFollowRequest } from './update-follow-request'
import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { FollowRequests } from '@src/modules/follow/domain/mappers'
import {
  FollowRequestNotFoundException,
  FollowRequestAlreadyProcessedException
} from '@src/modules/follow/domain/exceptions'

export class RejectFollowRequest {
  constructor(
    private readonly followRequestRepo: FollowRequestsRepository,
    private readonly updateFollowRequest: UpdateFollowRequest
  ) {}

  async execute(requestFollowId: string): Promise<FollowRequests> {
    const followRequest = await this.followRequestRepo.getById(requestFollowId)

    if (!followRequest) {
      throw new FollowRequestNotFoundException(requestFollowId)
    }

    if (followRequest.status !== 'pending') {
      throw new FollowRequestAlreadyProcessedException(requestFollowId)
    }

    const updatedRequest = await this.updateFollowRequest.execute(requestFollowId, { status: 'rejected' })

    return updatedRequest
  }
}
