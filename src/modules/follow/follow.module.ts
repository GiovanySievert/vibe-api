import {
  CreateFollower,
  DeleteFollower,
  ListFollowers,
  ListFollowings,
  IsFollowing,
  CreateFollowRequest,
  UpdateFollowRequest,
  ListFollowRequest,
  CreateFollowStats,
  DeleteFollowStats,
  CreateFollowingStats,
  DeleteFollowingStats,
  ListFollowStats
} from './application/use-cases'
import {
  DrizzleFollowRepository,
  DrizzleFollowRequestRepository,
  DrizzleFollowStatsRepository
} from './infrastructure/persistence'
import { FollowersController } from './infrastructure/http/controllers/followers.controller'
import { FollowRequestController } from './infrastructure/http/controllers/follow-request.controller'
import { FollowStatsController } from './infrastructure/http/controllers/follow-stats.controller'

export class FollowModule {
  public readonly followersController: FollowersController
  public readonly followRequestController: FollowRequestController
  public readonly followStatsController: FollowStatsController

  constructor() {
    const followersRepo = new DrizzleFollowRepository()
    const followRequestRepo = new DrizzleFollowRequestRepository()
    const followStatsRepo = new DrizzleFollowStatsRepository()

    const createFollowerService = new CreateFollower(followersRepo)
    const deleteFollowerService = new DeleteFollower(followersRepo)
    const listFollowersService = new ListFollowers(followersRepo)
    const listFollowingsService = new ListFollowings(followersRepo)
    const isFollowingService = new IsFollowing(followersRepo)

    const createFollowRequestService = new CreateFollowRequest(followRequestRepo)
    const updateFollowRequestService = new UpdateFollowRequest(followRequestRepo)
    const listFollowRequestService = new ListFollowRequest(followRequestRepo)

    const createFollowStatsService = new CreateFollowStats(followStatsRepo)
    const deleteFollowStatsService = new DeleteFollowStats(followStatsRepo)
    const createFollowingStatsService = new CreateFollowingStats(followStatsRepo)
    const deleteFollowingStatsService = new DeleteFollowingStats(followStatsRepo)
    const listFollowStatsService = new ListFollowStats(followStatsRepo)

    this.followersController = new FollowersController(isFollowingService)
    this.followRequestController = new FollowRequestController(
      createFollowRequestService,
      updateFollowRequestService,
      listFollowRequestService
    )
    this.followStatsController = new FollowStatsController(
      createFollowStatsService,
      deleteFollowStatsService,
      createFollowingStatsService,
      deleteFollowingStatsService,
      listFollowStatsService
    )
  }
}
