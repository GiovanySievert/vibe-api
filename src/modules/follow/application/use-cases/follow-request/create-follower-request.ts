import { FollowRequests } from '../../../domain/mappers'
import { FollowRequestsRepository, FollowersRepository } from '../../../domain/repositories'
import {
  CannotFollowYourselfException,
  AlreadyFollowingException,
  FollowRequestAlreadyExistsException
} from '../../../domain/exceptions'
import { FollowStatus } from '../../../domain/types'
import { UserBlockRepository } from '@src/modules/blocks/domain/repositories'
import { UserIsBlockedException } from '@src/modules/blocks/domain/exceptions'

export interface CreateFollowRequestData {
  requestedId: string
  requesterId: string
  status?: string
}

export class CreateFollowRequest {
  constructor(
    private readonly followRequestRepo: FollowRequestsRepository,
    private readonly followersRepo: FollowersRepository,
    private readonly userBlockRepo: UserBlockRepository
  ) {}

  async execute(data: CreateFollowRequestData): Promise<FollowRequests> {
    if (data.requesterId === data.requestedId) {
      throw new CannotFollowYourselfException(data.requesterId)
    }

    const isBlockedByRequested = await this.userBlockRepo.isBlocked(data.requestedId, data.requesterId)

    if (isBlockedByRequested) {
      throw new UserIsBlockedException()
    }

    const { status: followStatus } = await this.followersRepo.getFollowStatus(data.requesterId, data.requestedId)

    if (followStatus === FollowStatus.FOLLOWING) {
      throw new AlreadyFollowingException(data.requesterId, data.requestedId)
    }

    if (followStatus === FollowStatus.PENDING) {
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
