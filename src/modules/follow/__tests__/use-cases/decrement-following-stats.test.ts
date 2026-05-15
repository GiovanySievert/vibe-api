import { describe, it, expect, beforeEach } from 'bun:test'
import { DecrementFollowingStats } from '../../application/use-cases/follow-stats/decrement-following-stats'
import { MockFollowStatsRepository } from '../mocks/follow-stats.repository.mock'

describe('DecrementFollowingStats', () => {
  let repository: MockFollowStatsRepository
  let useCase: DecrementFollowingStats

  beforeEach(() => {
    repository = new MockFollowStatsRepository()
    useCase = new DecrementFollowingStats(repository)
  })

  it('should decrement followingCount on an existing row', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 2, followingCount: 7, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const stats = repository.getAll().find((s) => s.userId === 'user-1')!
    expect(stats.followingCount).toBe(6)
    expect(stats.followersCount).toBe(2)
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
    expect(stats.followingCount).toBe(0)
  })

  it('should not affect other users stats', async () => {
    repository.seed([
      { userId: 'user-1', followersCount: 0, followingCount: 5, updatedAt: new Date() },
      { userId: 'user-2', followersCount: 0, followingCount: 8, updatedAt: new Date() }
    ])

    await useCase.execute('user-1')

    const u1 = repository.getAll().find((s) => s.userId === 'user-1')!
    const u2 = repository.getAll().find((s) => s.userId === 'user-2')!
    expect(u1.followingCount).toBe(4)
    expect(u2.followingCount).toBe(8)
  })

  it('should propagate repository error', async () => {
    const failingRepo = {
      listFollowStats: async () => ({ userId: 'user-1', followersCount: 0, followingCount: 1, updatedAt: new Date() }),
      decrementFollowingStats: async () => {
        throw new Error('decrement failed')
      }
    } as unknown as ConstructorParameters<typeof DecrementFollowingStats>[0]

    const failingUseCase = new DecrementFollowingStats(failingRepo)

    await expect(failingUseCase.execute('user-1')).rejects.toThrow('decrement failed')
  })
})
