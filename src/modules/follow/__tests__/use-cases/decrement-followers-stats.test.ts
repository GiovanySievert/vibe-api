import { describe, it, expect, beforeEach } from 'bun:test'
import { DecrementFollowersStats } from '../../application/use-cases/follow-stats/decrement-followers-stats'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'

describe('DecrementFollowersStats', () => {
  let repository: MockFollowStatsRepository
  let useCase: DecrementFollowersStats

  beforeEach(() => {
    repository = new MockFollowStatsRepository()
    useCase = new DecrementFollowersStats(repository)
  })

  it('should decrement followersCount on an existing row', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 5, followingCount: 2, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const stats = repository.getAll().find((s) => s.userId === 'user-1')!
    expect(stats.followersCount).toBe(4)
    expect(stats.followingCount).toBe(2)
  })

  it('should be a no-op when stats row does not exist', async () => {
    await useCase.execute('user-1')

    expect(repository.getAll()).toHaveLength(0)
  })

  it('should not decrement below zero (guarded by repository)', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const stats = repository.getAll().find((s) => s.userId === 'user-1')!
    expect(stats.followersCount).toBe(0)
  })

  it('should not affect other users stats', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 5, followingCount: 0, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 8, followingCount: 0, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const u1 = repository.getAll().find((s) => s.userId === 'user-1')!
    const u2 = repository.getAll().find((s) => s.userId === 'user-2')!
    expect(u1.followersCount).toBe(4)
    expect(u2.followersCount).toBe(8)
  })

  it('should propagate repository error', async () => {
    const failingRepo = {
      listFollowStats: async () => ({ userId: 'user-1', followersCount: 1, followingCount: 0, updatedAt: new Date() }),
      decrementFollowersStats: async () => {
        throw new Error('decrement failed')
      }
    } as unknown as ConstructorParameters<typeof DecrementFollowersStats>[0]

    const failingUseCase = new DecrementFollowersStats(failingRepo)

    await expect(failingUseCase.execute('user-1')).rejects.toThrow('decrement failed')
  })
})
