import { describe, it, expect, beforeEach } from 'bun:test'
import { CreateFollower } from '../../application/use-cases/followers/create-follower'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'

describe('CreateFollower', () => {
  let repository: MockFollowersRepository
  let useCase: CreateFollower

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new CreateFollower(repository)
  })

  it('should create a new follower relationship', async () => {
    const data = {
      followerId: 'user-1',
      followingId: 'user-2'
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.followerId).toBe(data.followerId)
    expect(result.followingId).toBe(data.followingId)
    expect(result.createdAt).toBeInstanceOf(Date)
  })

  it('should add follower to repository', async () => {
    const data = {
      followerId: 'user-1',
      followingId: 'user-2'
    }

    await useCase.execute(data)

    const followers = repository.getAll()
    expect(followers).toHaveLength(1)
    expect(followers[0].followerId).toBe(data.followerId)
    expect(followers[0].followingId).toBe(data.followingId)
  })

  it('should allow same user to follow multiple users', async () => {
    const followerId = 'user-1'

    await useCase.execute({ followerId, followingId: 'user-2' })
    await useCase.execute({ followerId, followingId: 'user-3' })
    await useCase.execute({ followerId, followingId: 'user-4' })

    const followers = repository.getAll()
    expect(followers).toHaveLength(3)
    expect(followers.every((f) => f.followerId === followerId)).toBe(true)
  })

  it('should allow multiple users to follow same user', async () => {
    const followingId = 'user-popular'

    await useCase.execute({ followerId: 'user-1', followingId })
    await useCase.execute({ followerId: 'user-2', followingId })
    await useCase.execute({ followerId: 'user-3', followingId })

    const followers = repository.getAll()
    expect(followers).toHaveLength(3)
    expect(followers.every((f) => f.followingId === followingId)).toBe(true)
  })
})
