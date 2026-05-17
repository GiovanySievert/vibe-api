import { beforeEach, describe, expect, it } from 'bun:test'

import { GetFollowedStreaks } from '../../application/use-cases/get-followed-streaks'
import { MockStreakRepository } from '../mocks/streak.repository.mock'

describe('GetFollowedStreaks', () => {
  let getFollowedStreaks: GetFollowedStreaks
  let mockRepo: MockStreakRepository

  beforeEach(() => {
    mockRepo = new MockStreakRepository()
    getFollowedStreaks = new GetFollowedStreaks(mockRepo)
  })

  it('returns followed users with active streaks and count', async () => {
    mockRepo.seedFollowedStreaks('user-1', [
      { userId: 'friend-1', name: 'Lu Andrade', username: 'luandrade', image: null, currentStreak: 8 },
      { userId: 'friend-2', name: 'Rafael Costa', username: 'rafaccosta', image: null, currentStreak: 5 }
    ])

    const result = await getFollowedStreaks.execute('user-1', 5)

    expect(result.count).toBe(2)
    expect(result.friends.map((friend) => friend.currentStreak)).toEqual([8, 5])
  })

  it('honors the requested limit', async () => {
    mockRepo.seedFollowedStreaks('user-1', [
      { userId: 'friend-1', name: 'A', username: 'a', image: null, currentStreak: 8 },
      { userId: 'friend-2', name: 'B', username: 'b', image: null, currentStreak: 5 }
    ])

    const result = await getFollowedStreaks.execute('user-1', 1)

    expect(result.count).toBe(1)
    expect(result.friends[0].userId).toBe('friend-1')
  })
})
