import { beforeEach, describe, expect, it } from 'bun:test'

import { GetUserStreak } from '../../application/use-cases/get-user-streak'
import { MockStreakRepository } from '../mocks/streak.repository.mock'

describe('GetUserStreak', () => {
  let getUserStreak: GetUserStreak
  let mockRepo: MockStreakRepository

  beforeEach(() => {
    mockRepo = new MockStreakRepository()
    getUserStreak = new GetUserStreak(mockRepo)
  })

  it('should return the user streak and recent activity for an active user', async () => {
    mockRepo.seedStreak({
      userId: 'user-1',
      currentStreak: 3,
      longestStreak: 5,
      lastActiveWeek: 20,
      lastActiveYear: 2026,
      weeklyThreshold: 2,
      updatedAt: new Date()
    })
    mockRepo.seedActivity({
      id: 'a-1',
      userId: 'user-1',
      isoYear: 2026,
      isoWeek: 20,
      reviewCount: 2,
      streakContributed: true,
      createdAt: new Date()
    })

    const result = await getUserStreak.execute('user-1')

    expect(result.streak.currentStreak).toBe(3)
    expect(result.streak.longestStreak).toBe(5)
    expect(result.streak.weeklyThreshold).toBe(2)
    expect(result.streak.lastActiveWeek).toBe(20)
    expect(result.streak.lastActiveYear).toBe(2026)
    expect(result.recentActivity).toHaveLength(1)
    expect(result.recentActivity[0]).toEqual({
      isoYear: 2026,
      isoWeek: 20,
      reviewCount: 2,
      streakContributed: true
    })
  })

  it('should return default zeros and empty activity for a user with no streak record', async () => {
    const result = await getUserStreak.execute('user-without-streak')

    expect(result.streak.currentStreak).toBe(0)
    expect(result.streak.longestStreak).toBe(0)
    expect(result.streak.weeklyThreshold).toBe(2)
    expect(result.streak.lastActiveWeek).toBeNull()
    expect(result.streak.lastActiveYear).toBeNull()
    expect(result.recentActivity).toEqual([])
  })

  it('should propagate errors from the repository', async () => {
    const failingRepo: any = {
      getStreak: async () => {
        throw new Error('db down')
      },
      getWeeklyActivity: async () => []
    }
    const useCase = new GetUserStreak(failingRepo)

    await expect(useCase.execute('user-1')).rejects.toThrow('db down')
  })
})
