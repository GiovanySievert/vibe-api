import { describe, it, expect, beforeEach } from 'bun:test'
import { GetFollowStatus } from '../../application/use-cases/followers/get-follow-status'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { Followers } from '../../domain/mappers'

describe('GetFollowStatus', () => {
  let repository: MockFollowersRepository
  let useCase: GetFollowStatus

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new GetFollowStatus(repository)
  })

  it('should return status none when user is not following', async () => {
    const result = await useCase.execute('user-1', 'user-2')

    expect(result.status).toBe('none')
    expect(result.id).toBeUndefined()
  })

  it('should return status following with id when user is following', async () => {
    const follower: Followers = {
      id: crypto.randomUUID(),
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date()
    }

    repository.seed([follower])

    const result = await useCase.execute(follower.followerId, follower.followingId)

    expect(result.status).toBe('following')
    expect(result.id).toBe(follower.id)
  })

  it('should return status none without id when checking reverse relationship', async () => {
    const follower: Followers = {
      id: crypto.randomUUID(),
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date()
    }

    repository.seed([follower])

    const result = await useCase.execute(follower.followingId, follower.followerId)

    expect(result.status).toBe('none')
    expect(result.id).toBeUndefined()
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

    expect((await useCase.execute('user-1', 'user-2')).status).toBe('following')
    expect((await useCase.execute('user-1', 'user-3')).status).toBe('following')
    expect((await useCase.execute('user-2', 'user-3')).status).toBe('following')
    expect((await useCase.execute('user-2', 'user-1')).status).toBe('none')
  })
})
