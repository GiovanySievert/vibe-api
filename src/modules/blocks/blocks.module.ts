import {
  BlockUserWithCleanup,
  UnblockUser,
  CheckBlockStatus,
  ListBlockedUsers
} from './application/use-cases'
import { DrizzleUserBlockRepository } from './infrastructure/persistence'
import { UserBlockController } from './infrastructure/http/controllers/user-block.controller'
import { Unfollow, RemoveFollower } from '@src/modules/follow/application/use-cases'
import { DrizzleFollowRepository, DrizzleFollowRequestRepository, DrizzleFollowStatsRepository } from '@src/modules/follow/infrastructure/persistence'
import { DeleteFollower, DecrementFollowersStats, DecrementFollowingStats } from '@src/modules/follow/application/use-cases'

export class BlocksModule {
  public readonly userBlockController: UserBlockController

  constructor() {
    const userBlockRepo = new DrizzleUserBlockRepository()
    const followersRepo = new DrizzleFollowRepository()
    const followRequestRepo = new DrizzleFollowRequestRepository()
    const followStatsRepo = new DrizzleFollowStatsRepository()

    const deleteFollowerService = new DeleteFollower(followersRepo)
    const decrementFollowingStatsService = new DecrementFollowingStats(followStatsRepo)
    const decrementFollowersStatsService = new DecrementFollowersStats(followStatsRepo)

    const unfollowService = new Unfollow(
      followersRepo,
      deleteFollowerService,
      decrementFollowingStatsService,
      decrementFollowersStatsService
    )

    const removeFollowerService = new RemoveFollower(
      followersRepo,
      deleteFollowerService,
      decrementFollowingStatsService,
      decrementFollowersStatsService
    )

    const blockUserWithCleanupService = new BlockUserWithCleanup(
      userBlockRepo,
      unfollowService,
      removeFollowerService,
      followRequestRepo
    )
    const unblockUserService = new UnblockUser(userBlockRepo)
    const checkBlockStatusService = new CheckBlockStatus(userBlockRepo)
    const listBlockedUsersService = new ListBlockedUsers(userBlockRepo)

    this.userBlockController = new UserBlockController(
      blockUserWithCleanupService,
      unblockUserService,
      checkBlockStatusService,
      listBlockedUsersService
    )
  }
}
