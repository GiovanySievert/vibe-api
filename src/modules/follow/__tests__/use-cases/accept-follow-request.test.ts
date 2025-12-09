import { describe, it, expect, beforeEach } from 'bun:test'
import { AcceptFollowRequest } from '../../application/use-cases/follow-request/accept-follow-request'
import { UpdateFollowRequest } from '../../application/use-cases/follow-request/update-follow-request'
import { CreateFollower } from '../../application/use-cases/followers/create-follower'
import { IncrementFollowingStats } from '../../application/use-cases/follow-stats/increment-following-stats'
import { IncrementFollowersStats } from '../../application/use-cases/follow-stats/increment-followers-stats'
import { MockFollowRequestRepository } from '../mocks/follow-request.repository.mock'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'
import { FollowRequestNotFoundException } from '../../domain/exceptions/follow-request-not-found.exception'
import { FollowRequestAlreadyProcessedException } from '../../domain/exceptions/follow-request-already-processed.exception'
import { AlreadyFollowingException } from '../../domain/exceptions/already-following.exception'

describe('AcceptFollowRequest', () => {
  let followRequestRepo: MockFollowRequestRepository
  let followersRepo: MockFollowersRepository
  let followStatsRepo: MockFollowStatsRepository
  let updateFollowRequestService: UpdateFollowRequest
  let createFollowerService: CreateFollower
  let incrementFollowingStatsService: IncrementFollowingStats
  let incrementFollowersStatsService: IncrementFollowersStats
  let useCase: AcceptFollowRequest

  beforeEach(() => {
    followRequestRepo = new MockFollowRequestRepository()
    followersRepo = new MockFollowersRepository()
    followStatsRepo = new MockFollowStatsRepository()
    updateFollowRequestService = new UpdateFollowRequest(followRequestRepo)
    createFollowerService = new CreateFollower(followersRepo)
    incrementFollowingStatsService = new IncrementFollowingStats(followStatsRepo)
    incrementFollowersStatsService = new IncrementFollowersStats(followStatsRepo)
    useCase = new AcceptFollowRequest(
      followRequestRepo,
      followersRepo,
      updateFollowRequestService,
      createFollowerService,
      incrementFollowingStatsService,
      incrementFollowersStatsService
    )
  })

  it('should accept a follow request successfully', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute(followRequest.id!)

    expect(result.status).toBe('accepted')

    const followers = followersRepo.getAll()
    expect(followers).toHaveLength(1)
    expect(followers[0].followerId).toBe('user-1')
    expect(followers[0].followingId).toBe('user-2')

    const stats1 = await followStatsRepo.listFollowStats('user-1')
    expect(stats1[0].followingCount).toBe(1)

    const stats2 = await followStatsRepo.listFollowStats('user-2')
    expect(stats2[0].followersCount).toBe(1)
  })

  it('should throw FollowRequestNotFoundException when request does not exist', async () => {
    expect(async () => {
      await useCase.execute('non-existent-id')
    }).toThrow(FollowRequestNotFoundException)
  })

  it('should throw AlreadyFollowingException when request is already accepted', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'accepted',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    expect(async () => {
      await useCase.execute(followRequest.id!)
    }).toThrow(AlreadyFollowingException)
  })

  it('should throw FollowRequestAlreadyProcessedException when request is rejected', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'rejected',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    expect(async () => {
      await useCase.execute(followRequest.id!)
    }).toThrow(FollowRequestAlreadyProcessedException)
  })

  it('should increment stats correctly when accepting', async () => {
    followStatsRepo.seed([
      { userId: 'user-1', followersCount: 5, followingCount: 3, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 10, followingCount: 8, updatedAt: new Date() }
    ])

    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await useCase.execute(followRequest.id!)

    const stats1 = await followStatsRepo.listFollowStats('user-1')
    expect(stats1[0].followingCount).toBe(4)
    expect(stats1[0].followersCount).toBe(5)

    const stats2 = await followStatsRepo.listFollowStats('user-2')
    expect(stats2[0].followersCount).toBe(11)
    expect(stats2[0].followingCount).toBe(8)
  })
})
