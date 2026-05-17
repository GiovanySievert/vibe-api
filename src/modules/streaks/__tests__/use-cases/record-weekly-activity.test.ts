import { beforeEach, describe, expect, it } from 'bun:test'

import { RecordWeeklyActivity } from '../../application/use-cases/record-weekly-activity'
import { MockStreakRepository } from '../mocks/streak.repository.mock'

describe('RecordWeeklyActivity', () => {
  let recordWeeklyActivity: RecordWeeklyActivity
  let mockRepo: MockStreakRepository

  beforeEach(() => {
    mockRepo = new MockStreakRepository()
    recordWeeklyActivity = new RecordWeeklyActivity(mockRepo)
  })

  it('should not update the streak before reaching the weekly threshold', async () => {
    const monday = new Date(Date.UTC(2026, 4, 11))

    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result.triggered).toBe(false)
    expect(result.currentStreak).toBe(0)
    expect(result.reviewCount).toBe(1)
    expect(mockRepo.updateStreakCalls).toHaveLength(0)
    expect(mockRepo.activities).toHaveLength(1)
    expect(mockRepo.activities[0].reviewCount).toBe(1)
  })

  it('should start the streak at 1 on the exact review that hits the threshold without a previous active week', async () => {
    const monday = new Date(Date.UTC(2026, 4, 11))

    await recordWeeklyActivity.execute('user-1', monday)
    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result).toMatchObject({
      triggered: true,
      previousStreak: 0,
      currentStreak: 1,
      longestStreak: 1,
      weeklyThreshold: 2,
      reviewCount: 2,
      isoYear: 2026,
      isoWeek: 20
    })
    expect(mockRepo.updateStreakCalls).toHaveLength(1)
    expect(mockRepo.updateStreakCalls[0].currentStreak).toBe(1)
    expect(mockRepo.updateStreakCalls[0].longestStreak).toBe(1)
    expect(mockRepo.updateStreakCalls[0].isoYear).toBe(2026)
    expect(mockRepo.updateStreakCalls[0].isoWeek).toBe(20)
    expect(mockRepo.activities[0].streakContributed).toBe(true)
  })

  it('should update the streak when the review count is already above the threshold and not contributed', async () => {
    mockRepo.seedActivity({
      id: 'current',
      userId: 'user-1',
      isoYear: 2026,
      isoWeek: 20,
      reviewCount: 2,
      streakContributed: false,
      createdAt: new Date()
    })

    const monday = new Date(Date.UTC(2026, 4, 11))

    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result.triggered).toBe(true)
    expect(result.reviewCount).toBe(3)
    expect(mockRepo.updateStreakCalls).toHaveLength(1)
    expect(mockRepo.activities[0].reviewCount).toBe(3)
    expect(mockRepo.activities[0].streakContributed).toBe(true)
  })

  it('should not update the streak when the week already contributed', async () => {
    mockRepo.seedActivity({
      id: 'current',
      userId: 'user-1',
      isoYear: 2026,
      isoWeek: 20,
      reviewCount: 2,
      streakContributed: true,
      createdAt: new Date()
    })

    const monday = new Date(Date.UTC(2026, 4, 11))

    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result.triggered).toBe(false)
    expect(result.reviewCount).toBe(3)
    expect(mockRepo.updateStreakCalls).toHaveLength(0)
    expect(mockRepo.activities[0].reviewCount).toBe(3)
  })

  it('should increment the streak when the previous ISO week was active above the threshold', async () => {
    mockRepo.seedStreak({
      userId: 'user-1',
      currentStreak: 4,
      longestStreak: 4,
      lastActiveWeek: 19,
      lastActiveYear: 2026,
      weeklyThreshold: 2,
      updatedAt: new Date()
    })
    mockRepo.seedActivity({
      id: 'prev',
      userId: 'user-1',
      isoYear: 2026,
      isoWeek: 19,
      reviewCount: 3,
      streakContributed: true,
      createdAt: new Date()
    })

    const monday = new Date(Date.UTC(2026, 4, 11))
    await recordWeeklyActivity.execute('user-1', monday)
    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result.triggered).toBe(true)
    expect(result.previousStreak).toBe(4)
    expect(result.currentStreak).toBe(5)
    expect(mockRepo.updateStreakCalls).toHaveLength(1)
    expect(mockRepo.updateStreakCalls[0].currentStreak).toBe(5)
    expect(mockRepo.updateStreakCalls[0].longestStreak).toBe(5)
    expect(mockRepo.updateStreakCalls[0].isoWeek).toBe(20)
  })

  it('should reset the streak to 1 when there is a gap in the previous ISO week', async () => {
    mockRepo.seedStreak({
      userId: 'user-1',
      currentStreak: 7,
      longestStreak: 10,
      lastActiveWeek: 17,
      lastActiveYear: 2026,
      weeklyThreshold: 2,
      updatedAt: new Date()
    })

    const monday = new Date(Date.UTC(2026, 4, 11))
    await recordWeeklyActivity.execute('user-1', monday)
    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result.triggered).toBe(true)
    expect(result.previousStreak).toBe(7)
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(10)
    expect(mockRepo.updateStreakCalls).toHaveLength(1)
    expect(mockRepo.updateStreakCalls[0].currentStreak).toBe(1)
    expect(mockRepo.updateStreakCalls[0].longestStreak).toBe(10)
  })

  it('should not call updateStreak again once the review count goes above the threshold in the same week', async () => {
    const monday = new Date(Date.UTC(2026, 4, 11))

    await recordWeeklyActivity.execute('user-1', monday)
    await recordWeeklyActivity.execute('user-1', monday)
    await recordWeeklyActivity.execute('user-1', monday)
    const result = await recordWeeklyActivity.execute('user-1', monday)

    expect(result.triggered).toBe(false)
    expect(mockRepo.updateStreakCalls).toHaveLength(1)
    expect(mockRepo.activities[0].reviewCount).toBe(4)
    expect(mockRepo.updateStreakCalls[0].currentStreak).toBe(1)
  })

  it('should look up the previous ISO week in the prior year when recording in week 1', async () => {
    mockRepo.seedStreak({
      userId: 'user-1',
      currentStreak: 3,
      longestStreak: 3,
      lastActiveWeek: 52,
      lastActiveYear: 2024,
      weeklyThreshold: 2,
      updatedAt: new Date()
    })
    mockRepo.seedActivity({
      id: 'prev',
      userId: 'user-1',
      isoYear: 2024,
      isoWeek: 52,
      reviewCount: 4,
      streakContributed: true,
      createdAt: new Date()
    })

    const inIsoWeek1Of2025 = new Date(Date.UTC(2025, 0, 2))

    await recordWeeklyActivity.execute('user-1', inIsoWeek1Of2025)
    await recordWeeklyActivity.execute('user-1', inIsoWeek1Of2025)

    expect(mockRepo.updateStreakCalls).toHaveLength(1)
    expect(mockRepo.updateStreakCalls[0].isoYear).toBe(2025)
    expect(mockRepo.updateStreakCalls[0].isoWeek).toBe(1)
    expect(mockRepo.updateStreakCalls[0].currentStreak).toBe(4)
    expect(mockRepo.updateStreakCalls[0].longestStreak).toBe(4)
  })

  it('should propagate errors from the repository', async () => {
    const failingRepo: any = {
      upsertWeeklyActivity: async () => {
        throw new Error('upsert failed')
      },
      getStreak: async () => null,
      updateStreak: async () => {},
      getWeeklyActivity: async () => [],
      getWeekActivity: async () => null
    }
    const useCase = new RecordWeeklyActivity(failingRepo)

    await expect(useCase.execute('user-1', new Date(Date.UTC(2026, 4, 11)))).rejects.toThrow('upsert failed')
  })
})
