import { describe, it, expect, beforeEach } from 'bun:test'
import { ListFollowStats } from '../../application/use-cases/follow-stats/list-follow-stats'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'

describe('ListFollowStats', () => {
  let repository: MockFollowStatsRepository
  let useCase: ListFollowStats

  beforeEach(() => {
    repository = new MockFollowStatsRepository()
    useCase = new ListFollowStats(repository)
  })

  it('should list follow stats for a user', async () => {
    repository.seed([
      {
        userId: 'user-1',
        followersCount: 10,
        followingCount: 5,
        updatedAt: new Date()
      }
    ])

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
    expect(result[0].followersCount).toBe(10)
    expect(result[0].followingCount).toBe(5)
  })

  it('should return empty array when user has no stats', async () => {
    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should only return stats for the specified user', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 10, followingCount: 5, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 20, followingCount: 15, updatedAt: new Date() },
      { userId: 'user-3', followersCount: 30, followingCount: 25, updatedAt: new Date() }
    ])

    const result = await useCase.execute('user-2')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-2')
    expect(result[0].followersCount).toBe(20)
    expect(result[0].followingCount).toBe(15)
  })

  it('should return correct stats values', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 0, updatedAt: new Date() }
    ])

    const result = await useCase.execute('user-1')

    expect(result[0].followersCount).toBe(0)
    expect(result[0].followingCount).toBe(0)
  })
})
