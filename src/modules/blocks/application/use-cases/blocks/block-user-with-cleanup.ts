import { UserBlockRepository } from '../../../domain/repositories'
import { CannotBlockYourselfException, UserAlreadyBlockedException } from '../../../domain/exceptions'
import { UserBlock } from '../../../domain/mappers'
import { Unfollow, RemoveFollower } from '@src/modules/follow/application/use-cases'
import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { FollowRequestStatus } from '@src/modules/follow/domain/types'

export class BlockUserWithCleanup {
  constructor(
    private readonly userBlockRepository: UserBlockRepository,
    private readonly unfollow: Unfollow,
    private readonly removeFollower: RemoveFollower,
    private readonly followRequestRepository: FollowRequestsRepository
  ) {}

  async execute(blockerId: string, blockedId: string): Promise<UserBlock> {
    if (blockerId === blockedId) {
      throw new CannotBlockYourselfException()
    }

    const existingBlock = await this.userBlockRepository.findBlock(blockerId, blockedId)
    if (existingBlock) {
      throw new UserAlreadyBlockedException()
    }

    try {
      await this.unfollow.execute(blockerId, blockedId)
    } catch {}

    try {
      await this.removeFollower.execute(blockerId, blockedId)
    } catch {}

    const requestFromBlocker = await this.followRequestRepository.getPendingRequest(blockerId, blockedId)
    if (requestFromBlocker && requestFromBlocker.id) {
      await this.followRequestRepository.update(requestFromBlocker.id, FollowRequestStatus.CANCELLED)
    }

    const requestFromBlocked = await this.followRequestRepository.getPendingRequest(blockedId, blockerId)
    if (requestFromBlocked && requestFromBlocked.id) {
      await this.followRequestRepository.update(requestFromBlocked.id, FollowRequestStatus.CANCELLED)
    }

    return await this.userBlockRepository.create(blockerId, blockedId)
  }
}
