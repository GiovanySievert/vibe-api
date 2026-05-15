import { describe, it, expect, beforeEach } from 'bun:test'
import { Unfollow } from '../../application/use-cases/followers/unfollow'
import { DeleteFollower } from '../../application/use-cases/followers/delete-follower'
import { DecrementFollowingStats } from '../../application/use-cases/follow-stats/decrement-following-stats'
import { DecrementFollowersStats } from '../../application/use-cases/follow-stats/decrement-followers-stats'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'
import { FollowRelationshipNotFoundException } from '../../domain/exceptions/follow-relationship-not-found.exception'

describe('Unfollow', () => {
  let followersRepo: MockFollowersRepository
  let followStatsRepo: MockFollowStatsRepository
  let deleteFollowerService: DeleteFollower
  let decrementFollowingStatsService: DecrementFollowingStats
  let decrementFollowersStatsService: DecrementFollowersStats
  let useCase: Unfollow

  beforeEach(() => {
    followersRepo = new MockFollowersRepository()
    followStatsRepo = new MockFollowStatsRepository()
    deleteFollowerService = new DeleteFollower(followersRepo)
    decrementFollowingStatsService = new DecrementFollowingStats(followStatsRepo)
    decrementFollowersStatsService = new DecrementFollowersStats(followStatsRepo)
    useCase = new Unfollow(
      followersRepo,
      deleteFollowerService,
      decrementFollowingStatsService,
      decrementFollowersStatsService
    )
  })

  it('should unfollow a user successfully', async () => {
    const follower = await followersRepo.create({
      followerId: 'user-1',
      followingId: 'user-2'
    })

    followStatsRepo.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 1, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 1, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.execute('user-1', 'user-2')

    const followers = followersRepo.getAll()
    expect(followers).toHaveLength(0)

    const stats1 = await followStatsRepo.listFollowStats('user-1')
    expect(stats1?.followingCount).toBe(0)

    const stats2 = await followStatsRepo.listFollowStats('user-2')
    expect(stats2?.followersCount).toBe(0)
  })

  it('should throw FollowRelationshipNotFoundException when relationship does not exist', async () => {
    expect(async () => {
      await useCase.execute('user-1', 'user-2')
    }).toThrow(FollowRelationshipNotFoundException)
  })

  it('should decrement stats correctly', async () => {
    await followersRepo.create({
      followerId: 'user-1',
      followingId: 'user-2'
    })

    followStatsRepo.seed([
      { userId: 'user-1', followersCount: 5, followingCount: 10, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 20, followingCount: 3, updatedAt: new Date() }
    ])

    await useCase.execute('user-1', 'user-2')

    const stats1 = await followStatsRepo.listFollowStats('user-1')
    expect(stats1?.followingCount).toBe(9)
    expect(stats1?.followersCount).toBe(5)

    const stats2 = await followStatsRepo.listFollowStats('user-2')
    expect(stats2?.followersCount).toBe(19)
    expect(stats2?.followingCount).toBe(3)
  })
})
