import { describe, it, expect, beforeEach } from 'bun:test'
import { IncrementFollowingStats } from '../../application/use-cases/follow-stats/increment-following-stats'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'

describe('IncrementFollowingStats', () => {
  let repository: MockFollowStatsRepository
  let useCase: IncrementFollowingStats

  beforeEach(() => {
    repository = new MockFollowStatsRepository()
    useCase = new IncrementFollowingStats(repository)
  })

  it('should create stats row with followingCount=1 when none exists', async () => {
    const result = await useCase.execute('user-1')

    expect(result.userId).toBe('user-1')
    expect(result.followingCount).toBe(1)
    expect(result.followersCount).toBe(0)
  })

  it('should increment followingCount on an existing row', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 3, followingCount: 7, updatedAt: new Date() }
    ])

    const result = await useCase.execute('user-1')

    expect(result.followingCount).toBe(8)
    expect(result.followersCount).toBe(3)
  })

  it('should accumulate across multiple invocations', async () => {
    await useCase.execute('user-1')
    await useCase.execute('user-1')
    const result = await useCase.execute('user-1')

    expect(result.followingCount).toBe(3)
  })

  it('should not affect other users stats', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 5, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 0, followingCount: 12, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const all = repository.getAll()
    const u1 = all.find((s) => s.userId === 'user-1')!
    const u2 = all.find((s) => s.userId === 'user-2')!
    expect(u1.followingCount).toBe(6)
    expect(u2.followingCount).toBe(12)
  })

  it('should propagate repository error', async () => {
    const failingRepo = {
      incrementFollowingStats: async () => {
        throw new Error('boom')
      }
    } as unknown as ConstructorParameters<typeof IncrementFollowingStats>[0]

    const failingUseCase = new IncrementFollowingStats(failingRepo)

    await expect(failingUseCase.execute('user-1')).rejects.toThrow('boom')
  })
})
