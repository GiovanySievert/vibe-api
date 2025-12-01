import {
  CreateFollower,
  DeleteFollower,
  ListFollowers,
  ListFollowings,
  IsFollowing,
  Unfollow,
  CreateFollowRequest,
  UpdateFollowRequest,
  ListFollowRequest,
  AcceptFollowRequest,
  RejectFollowRequest,
  CancelFollowRequest,
  DeleteFollowStats,
  DeleteFollowingStats,
  ListFollowStats,
  IncrementFollowingStats,
  IncrementFollowersStats
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
    const isFollowingService = new IsFollowing(followersRepo)

    const incrementFollowingStatsService = new IncrementFollowingStats(followStatsRepo)
    const incrementFollowersStatsService = new IncrementFollowersStats(followStatsRepo)
    const deleteFollowingStatsService = new DeleteFollowingStats(followStatsRepo)
    const deleteFollowStatsService = new DeleteFollowStats(followStatsRepo)

    const unfollowService = new Unfollow(
      followersRepo,
      deleteFollowerService,
      deleteFollowingStatsService,
      deleteFollowStatsService
    )

    const createFollowRequestService = new CreateFollowRequest(followRequestRepo, followersRepo)
    const updateFollowRequestService = new UpdateFollowRequest(followRequestRepo)
    const listFollowRequestService = new ListFollowRequest(followRequestRepo)

    const acceptFollowRequestService = new AcceptFollowRequest(
      followRequestRepo,
      followersRepo,
      updateFollowRequestService,
      createFollowerService,
      incrementFollowingStatsService,
      incrementFollowersStatsService
    )
    const rejectFollowRequestService = new RejectFollowRequest(followRequestRepo, updateFollowRequestService)
    const cancelFollowRequestService = new CancelFollowRequest(followRequestRepo, updateFollowRequestService)

    const listFollowStatsService = new ListFollowStats(followStatsRepo)

    this.followersController = new FollowersController(isFollowingService, unfollowService)
    this.followRequestController = new FollowRequestController(
      createFollowRequestService,
      updateFollowRequestService,
      listFollowRequestService,
      acceptFollowRequestService,
      rejectFollowRequestService,
      cancelFollowRequestService
    )
    this.followStatsController = new FollowStatsController(
      incrementFollowersStatsService,
      deleteFollowStatsService,
      incrementFollowingStatsService,
      deleteFollowingStatsService,
      listFollowStatsService
    )
  }
}
