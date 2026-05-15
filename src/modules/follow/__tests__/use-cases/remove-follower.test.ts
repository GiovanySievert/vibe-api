import { describe, it, expect, beforeEach } from 'bun:test'
import { RemoveFollower } from '../../application/use-cases/followers/remove-follower'
import { DeleteFollower } from '../../application/use-cases/followers/delete-follower'
import { DecrementFollowersStats } from '../../application/use-cases/follow-stats/decrement-followers-stats'
import { DecrementFollowingStats } from '../../application/use-cases/follow-stats/decrement-following-stats'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'
import { FollowRelationshipNotFoundException } from '../../domain/exceptions/follow-relationship-not-found.exception'
import { UnauthorizedFollowRequestActionException } from '../../domain/exceptions/unauthorized-follow-request-action.exception'
import { Followers } from '../../domain/mappers'

class FollowersRepoWithGetById extends MockFollowersRepository {
  async getById(followId: string): Promise<Followers | null> {
    return this.getAll().find((f) => f.id === followId) || null
  }
}

describe('RemoveFollower', () => {
  let followersRepo: FollowersRepoWithGetById
  let followStatsRepo: MockFollowStatsRepository
  let deleteFollower: DeleteFollower
  let decrementFollowingStats: DecrementFollowingStats
  let decrementFollowersStats: DecrementFollowersStats
  let useCase: RemoveFollower

  beforeEach(() => {
    followersRepo = new FollowersRepoWithGetById()
    followStatsRepo = new MockFollowStatsRepository()
    deleteFollower = new DeleteFollower(followersRepo)
    decrementFollowingStats = new DecrementFollowingStats(followStatsRepo)
    decrementFollowersStats = new DecrementFollowersStats(followStatsRepo)
    useCase = new RemoveFollower(followersRepo, deleteFollower, decrementFollowingStats, decrementFollowersStats)
  })

  it('should remove a follower and decrement stats when called by the followed user', async () => {
    const follow: Followers = {
      id: 'follow-1',
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date()
    }
    followersRepo.seed([follow])
    followStatsRepo.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 1, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 1, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.execute('user-2', 'follow-1')

    expect(followersRepo.getAll()).toHaveLength(0)
    const followerStats = await followStatsRepo.listFollowStats('user-1')
    expect(followerStats?.followingCount).toBe(0)
    const followingStats = await followStatsRepo.listFollowStats('user-2')
    expect(followingStats?.followersCount).toBe(0)
  })

  it('should remove a follower by user relationship', async () => {
    followersRepo.seed([
      { id: 'follow-1', followerId: 'user-1', followingId: 'user-2', createdAt: new Date() }
    ])
    followStatsRepo.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 1, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 1, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.executeByUsers('user-2', 'user-1')

    expect(followersRepo.getAll()).toHaveLength(0)
  })

  it('should only remove the targeted follow relationship and leave others intact', async () => {
    followersRepo.seed([
      { id: 'follow-1', followerId: 'user-1', followingId: 'user-2', createdAt: new Date() },
      { id: 'follow-2', followerId: 'user-3', followingId: 'user-2', createdAt: new Date() }
    ])
    followStatsRepo.seed([
      { userId: 'user-2', followersCount: 2, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.execute('user-2', 'follow-1')

    const remaining = followersRepo.getAll()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe('follow-2')
  })

  it('should throw FollowRelationshipNotFoundException when the follow id does not exist', async () => {
    expect(async () => {
      await useCase.execute('user-2', 'missing-follow-id')
    }).toThrow(FollowRelationshipNotFoundException)
  })

  it('should throw UnauthorizedFollowRequestActionException when caller is not the followed user', async () => {
    followersRepo.seed([
      { id: 'follow-1', followerId: 'user-1', followingId: 'user-2', createdAt: new Date() }
    ])

    expect(async () => {
      await useCase.execute('user-99', 'follow-1')
    }).toThrow(UnauthorizedFollowRequestActionException)
  })
})
