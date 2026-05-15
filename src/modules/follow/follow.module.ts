import {
  CreateFollower,
  DeleteFollower,
  ListFollowers,
  ListFollowings,
  SearchFollowers,
  SearchFollowings,
  GetFollowStatus,
  Unfollow,
  RemoveFollower,
  CreateFollowRequest,
  ListFollowRequest,
  AcceptFollowRequest,
  RejectFollowRequest,
  CancelFollowRequest,
  DecrementFollowersStats,
  DecrementFollowingStats,
  ListFollowStats,
  IncrementFollowingStats,
  IncrementFollowersStats,
  ListRequestedFollowRequest
} from './application/use-cases'
import { UpdateFollowRequest } from './application/use-cases/follow-request/update-follow-request'
import { applicationEventBus } from '@src/shared/application/events'
import {
  DrizzleFollowRepository,
  DrizzleFollowRequestRepository,
  DrizzleFollowStatsRepository
} from './infrastructure/persistence'
import { FollowersController } from './infrastructure/http/controllers/followers.controller'
import { FollowRequestController } from './infrastructure/http/controllers/follow-request.controller'
import { FollowStatsController } from './infrastructure/http/controllers/follow-stats.controller'
import { DrizzleUserBlockRepository } from '@src/modules/blocks/infrastructure/persistence'

export class FollowModule {
  public readonly followersController: FollowersController
  public readonly followRequestController: FollowRequestController
  public readonly followStatsController: FollowStatsController

  constructor() {
    const followersRepo = new DrizzleFollowRepository()
    const followRequestRepo = new DrizzleFollowRequestRepository()
    const followStatsRepo = new DrizzleFollowStatsRepository()
    const userBlockRepo = new DrizzleUserBlockRepository()

    const createFollowerService = new CreateFollower(followersRepo)
    const deleteFollowerService = new DeleteFollower(followersRepo)
    const getFollowStatusService = new GetFollowStatus(followersRepo)
    const listFollowersService = new ListFollowers(followersRepo)
    const listFollowingsService = new ListFollowings(followersRepo)
    const searchFollowersService = new SearchFollowers(followersRepo)
    const searchFollowingsService = new SearchFollowings(followersRepo)

    const incrementFollowingStatsService = new IncrementFollowingStats(followStatsRepo)
    const incrementFollowersStatsService = new IncrementFollowersStats(followStatsRepo)
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

    const createFollowRequestService = new CreateFollowRequest(
      followRequestRepo,
      followersRepo,
      userBlockRepo,
      applicationEventBus
    )
    const updateFollowRequestService = new UpdateFollowRequest(followRequestRepo)
    const listFollowRequestService = new ListFollowRequest(followRequestRepo)
    const listRequestedFollowRequestService = new ListRequestedFollowRequest(followRequestRepo)

    const acceptFollowRequestService = new AcceptFollowRequest(
      followRequestRepo,
      followersRepo,
      updateFollowRequestService,
      createFollowerService,
      incrementFollowingStatsService,
      incrementFollowersStatsService,
      applicationEventBus
    )
    const rejectFollowRequestService = new RejectFollowRequest(followRequestRepo, updateFollowRequestService)
    const cancelFollowRequestService = new CancelFollowRequest(followRequestRepo, updateFollowRequestService)

    const listFollowStatsService = new ListFollowStats(followStatsRepo)

    this.followersController = new FollowersController(
      getFollowStatusService,
      unfollowService,
      removeFollowerService,
      listFollowersService,
      listFollowingsService,
      searchFollowersService,
      searchFollowingsService
    )
    this.followRequestController = new FollowRequestController(
      createFollowRequestService,
      listFollowRequestService,
      listRequestedFollowRequestService,
      acceptFollowRequestService,
      rejectFollowRequestService,
      cancelFollowRequestService
    )
    this.followStatsController = new FollowStatsController(
      incrementFollowersStatsService,
      decrementFollowersStatsService,
      incrementFollowingStatsService,
      decrementFollowingStatsService,
      listFollowStatsService
    )
  }
}
