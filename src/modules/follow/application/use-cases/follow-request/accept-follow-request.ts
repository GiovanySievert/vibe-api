import { CreateFollower } from '../followers/create-follower'
import { UpdateFollowRequest } from './update-follow-request'
import { IncrementFollowersStats } from '../follow-stats/increment-followers-stats'
import { IncrementFollowingStats } from '../follow-stats/increment-following-stats'
import { FollowRequestsRepository, FollowersRepository } from '@src/modules/follow/domain/repositories'
import { FollowRequests } from '@src/modules/follow/domain/mappers'
import {
  FollowRequestNotFoundException,
  FollowRequestAlreadyProcessedException,
  AlreadyFollowingException
} from '@src/modules/follow/domain/exceptions'

export class AcceptFollowRequest {
  constructor(
    private readonly followRequestRepo: FollowRequestsRepository,
    private readonly followersRepo: FollowersRepository,
    private readonly updateFollowRequest: UpdateFollowRequest,
    private readonly createFollow: CreateFollower,
    private readonly incrementFollowingStats: IncrementFollowingStats,
    private readonly incrementFollowersStats: IncrementFollowersStats
  ) {}

  async execute(requestFollowId: string): Promise<FollowRequests> {
    const followRequest = await this.followRequestRepo.getById(requestFollowId)

    if (!followRequest) {
      throw new FollowRequestNotFoundException(requestFollowId)
    }

    if (followRequest.status !== 'pending') {
      throw new FollowRequestAlreadyProcessedException(requestFollowId)
    }

    const alreadyFollowing = await this.followersRepo.isFollowing(followRequest.requesterId, followRequest.requestedId)

    if (alreadyFollowing) {
      throw new AlreadyFollowingException(followRequest.requesterId, followRequest.requestedId)
    }

    const updatedRequest = await this.updateFollowRequest.execute(requestFollowId, { status: 'accepted' })

    await this.createFollow.execute({
      followerId: followRequest.requesterId,
      followingId: followRequest.requestedId
    })

    await this.incrementFollowingStats.execute(followRequest.requesterId)
    await this.incrementFollowersStats.execute(followRequest.requestedId)

    return updatedRequest
  }
}
