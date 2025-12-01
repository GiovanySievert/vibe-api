import { describe, it, expect, beforeEach } from 'bun:test'
import { ListFollowings } from '../../application/use-cases/followers/list-followings'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'

describe('ListFollowings', () => {
  let repository: MockFollowersRepository
  let useCase: ListFollowings

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new ListFollowings(repository)
  })

  it('should list all users that a user is following', async () => {
    await repository.create({ followerId: 'user-1', followingId: 'user-2' })
    await repository.create({ followerId: 'user-1', followingId: 'user-3' })
    await repository.create({ followerId: 'user-1', followingId: 'user-4' })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(3)
    expect(result[0].userId).toBe('user-2')
    expect(result[1].userId).toBe('user-3')
    expect(result[2].userId).toBe('user-4')
  })

  it('should return empty array when user is not following anyone', async () => {
    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should not include followers in the list', async () => {
    await repository.create({ followerId: 'user-2', followingId: 'user-1' })
    await repository.create({ followerId: 'user-3', followingId: 'user-1' })
    await repository.create({ followerId: 'user-1', followingId: 'user-4' })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-4')
  })

  it('should return correct user information', async () => {
    await repository.create({ followerId: 'user-1', followingId: 'user-2' })

    const result = await useCase.execute('user-1')

    expect(result[0].userId).toBe('user-2')
    expect(result[0].username).toBe('user-user-2')
    expect(result[0].image).toBeNull()
  })
})
