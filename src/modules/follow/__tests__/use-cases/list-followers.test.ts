import { describe, it, expect, beforeEach } from 'bun:test'
import { ListFollowers } from '../../application/use-cases/followers/list-followers'
import { ListFollowings } from '../../application/use-cases/followers/list-followings'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { Followers } from '../../domain/mappers'

describe('ListFollowers', () => {
  let repository: MockFollowersRepository
  let listFollowersUseCase: ListFollowers
  let listFollowingsUseCase: ListFollowings

  beforeEach(() => {
    repository = new MockFollowersRepository()
    listFollowersUseCase = new ListFollowers(repository)
    listFollowingsUseCase = new ListFollowings(repository)
  })

  describe('ListFollowers', () => {
    it('should return empty array when user has no followers', async () => {
      const result = await listFollowersUseCase.execute('user-1')

      expect(result).toEqual([])
    })

    it('should return list of followers', async () => {
      const userId = 'user-popular'
      const followers: Followers[] = [
        {
          id: crypto.randomUUID(),
          followerId: 'user-1',
          followingId: userId,
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: 'user-2',
          followingId: userId,
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: 'user-3',
          followingId: userId,
          createdAt: new Date()
        }
      ]

      repository.seed(followers)

      const result = await listFollowersUseCase.execute(userId)

      expect(result).toHaveLength(3)
      expect(result[0].userId).toBe('user-1')
      expect(result[1].userId).toBe('user-2')
      expect(result[2].userId).toBe('user-3')
    })

    it('should only return followers of specific user', async () => {
      const followers: Followers[] = [
        {
          id: crypto.randomUUID(),
          followerId: 'user-1',
          followingId: 'user-target',
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: 'user-2',
          followingId: 'user-other',
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: 'user-3',
          followingId: 'user-target',
          createdAt: new Date()
        }
      ]

      repository.seed(followers)

      const result = await listFollowersUseCase.execute('user-target')

      expect(result).toHaveLength(2)
      expect(result.every((f) => f.userId === 'user-1' || f.userId === 'user-3')).toBe(true)
    })
  })

  describe('ListFollowings', () => {
    it('should return empty array when user is not following anyone', async () => {
      const result = await listFollowingsUseCase.execute('user-1')

      expect(result).toEqual([])
    })

    it('should return list of users being followed', async () => {
      const userId = 'user-1'
      const followers: Followers[] = [
        {
          id: crypto.randomUUID(),
          followerId: userId,
          followingId: 'user-2',
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: userId,
          followingId: 'user-3',
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: userId,
          followingId: 'user-4',
          createdAt: new Date()
        }
      ]

      repository.seed(followers)

      const result = await listFollowingsUseCase.execute(userId)

      expect(result).toHaveLength(3)
      expect(result[0].userId).toBe('user-2')
      expect(result[1].userId).toBe('user-3')
      expect(result[2].userId).toBe('user-4')
    })

    it('should only return followings of specific user', async () => {
      const followers: Followers[] = [
        {
          id: crypto.randomUUID(),
          followerId: 'user-target',
          followingId: 'user-1',
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: 'user-other',
          followingId: 'user-2',
          createdAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          followerId: 'user-target',
          followingId: 'user-3',
          createdAt: new Date()
        }
      ]

      repository.seed(followers)

      const result = await listFollowingsUseCase.execute('user-target')

      expect(result).toHaveLength(2)
      expect(result.every((f) => f.userId === 'user-1' || f.userId === 'user-3')).toBe(true)
    })
  })
})
