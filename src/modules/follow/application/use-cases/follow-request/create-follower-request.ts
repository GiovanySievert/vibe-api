import { createFollowRequestCreatedEvent } from '../../events/follow-request-created.event'
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
import { ApplicationEventBus } from '@src/shared/application/events'

export interface CreateFollowRequestData {
  requestedId: string
  requesterId: string
  requesterName: string
  status?: string
}

export class CreateFollowRequest {
  constructor(
    private readonly followRequestRepo: FollowRequestsRepository,
    private readonly followersRepo: FollowersRepository,
    private readonly userBlockRepo: UserBlockRepository,
    private readonly applicationEventBus: ApplicationEventBus
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

    if (!followerRequest.id) {
      throw new Error('Follow request id was not generated')
    }

    await this.applicationEventBus.publish(
      createFollowRequestCreatedEvent({
        followRequestId: followerRequest.id,
        requesterId: data.requesterId,
        requesterName: data.requesterName,
        requestedId: data.requestedId
      })
    )

    return followerRequest
  }
}
