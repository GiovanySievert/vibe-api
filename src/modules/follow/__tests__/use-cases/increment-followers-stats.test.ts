import { describe, it, expect, beforeEach } from 'bun:test'
import { IncrementFollowersStats } from '../../application/use-cases/follow-stats/increment-followers-stats'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'

describe('IncrementFollowersStats', () => {
  let repository: MockFollowStatsRepository
  let useCase: IncrementFollowersStats

  beforeEach(() => {
    repository = new MockFollowStatsRepository()
    useCase = new IncrementFollowersStats(repository)
  })

  it('should create stats row with followersCount=1 when none exists', async () => {
    const result = await useCase.execute('user-1')

    expect(result.userId).toBe('user-1')
    expect(result.followersCount).toBe(1)
    expect(result.followingCount).toBe(0)
  })

  it('should increment followersCount on an existing row', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 4, followingCount: 2, updatedAt: new Date() }
    ])

    const result = await useCase.execute('user-1')

    expect(result.followersCount).toBe(5)
    expect(result.followingCount).toBe(2)
  })

  it('should accumulate across multiple invocations', async () => {
    await useCase.execute('user-1')
    await useCase.execute('user-1')
    const result = await useCase.execute('user-1')

    expect(result.followersCount).toBe(3)
  })

  it('should not affect other users stats', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 10, followingCount: 0, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 20, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const all = repository.getAll()
    const u1 = all.find((s) => s.userId === 'user-1')!
    const u2 = all.find((s) => s.userId === 'user-2')!
    expect(u1.followersCount).toBe(11)
    expect(u2.followersCount).toBe(20)
  })

  it('should propagate repository error', async () => {
    const failingRepo = {
      incrementFollowersStats: async () => {
        throw new Error('increment failed')
      }
    } as unknown as ConstructorParameters<typeof IncrementFollowersStats>[0]

    const failingUseCase = new IncrementFollowersStats(failingRepo)

    await expect(failingUseCase.execute('user-1')).rejects.toThrow('increment failed')
  })
})
