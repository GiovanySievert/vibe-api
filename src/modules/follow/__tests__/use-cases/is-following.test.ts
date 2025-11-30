import { describe, it, expect, beforeEach } from 'bun:test'
import { IsFollowing } from '../../application/use-cases/followers/is-following'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { Followers } from '../../domain/mappers'

describe('IsFollowing', () => {
  let repository: MockFollowersRepository
  let useCase: IsFollowing

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new IsFollowing(repository)
  })

  it('should return false when user is not following', async () => {
    const result = await useCase.execute('user-1', 'user-2')

    expect(result).toBe(false)
  })

  it('should return true when user is following', async () => {
    const follower: Followers = {
      id: crypto.randomUUID(),
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date()
    }

    repository.seed([follower])

    const result = await useCase.execute(follower.followerId, follower.followingId)

    expect(result).toBe(true)
  })

  it('should return false when checking reverse relationship', async () => {
    const follower: Followers = {
      id: crypto.randomUUID(),
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date()
    }

    repository.seed([follower])

    const result = await useCase.execute(follower.followingId, follower.followerId)

    expect(result).toBe(false)
  })

  it('should handle multiple follow relationships correctly', async () => {
    const followers: Followers[] = [
      {
        id: crypto.randomUUID(),
        followerId: 'user-1',
        followingId: 'user-2',
        createdAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        followerId: 'user-1',
        followingId: 'user-3',
        createdAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        followerId: 'user-2',
        followingId: 'user-3',
        createdAt: new Date()
      }
    ]

    repository.seed(followers)

    expect(await useCase.execute('user-1', 'user-2')).toBe(true)
    expect(await useCase.execute('user-1', 'user-3')).toBe(true)
    expect(await useCase.execute('user-2', 'user-3')).toBe(true)
    expect(await useCase.execute('user-2', 'user-1')).toBe(false)
  })
})
