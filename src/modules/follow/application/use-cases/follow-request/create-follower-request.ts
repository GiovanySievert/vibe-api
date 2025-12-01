import { FollowRequests } from '../../../domain/mappers'
import { FollowRequestsRepository, FollowersRepository } from '../../../domain/repositories'
import {
  CannotFollowYourselfException,
  AlreadyFollowingException,
  FollowRequestAlreadyExistsException
} from '../../../domain/exceptions'

export interface CreateFollowRequestData {
  requestedId: string
  requesterId: string
  status?: string
}

export class CreateFollowRequest {
  constructor(
    private readonly followRequestRepo: FollowRequestsRepository,
    private readonly followersRepo: FollowersRepository
  ) {}

  async execute(data: CreateFollowRequestData): Promise<FollowRequests> {
    if (data.requesterId === data.requestedId) {
      throw new CannotFollowYourselfException(data.requesterId)
    }

    const alreadyFollowing = await this.followersRepo.isFollowing(data.requesterId, data.requestedId)

    if (alreadyFollowing) {
      throw new AlreadyFollowingException(data.requesterId, data.requestedId)
    }

    const existingRequest = await this.followRequestRepo.getPendingRequest(data.requesterId, data.requestedId)

    if (existingRequest) {
      throw new FollowRequestAlreadyExistsException(data.requesterId, data.requestedId)
    }

    const followerRequest = await this.followRequestRepo.create({
      requestedId: data.requestedId,
      requesterId: data.requesterId,
      status: data.status
    })

    return followerRequest
  }
}
