import { describe, it, expect, beforeEach } from 'bun:test'
import { SearchFollowers } from '../../application/use-cases/followers/search-followers'
import { SearchFollowings } from '../../application/use-cases/followers/search-followings'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { Followers } from '../../domain/mappers'

describe('SearchFollowers', () => {
  let repository: MockFollowersRepository
  let useCase: SearchFollowers

  const makeFollower = (followerId: string, followingId: string): Followers => ({
    id: crypto.randomUUID(),
    followerId,
    followingId,
    createdAt: new Date()
  })

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new SearchFollowers(repository)
  })

  it('should return followers matching by username', async () => {
    repository.seed([
      makeFollower('user-1', 'user-target'),
      makeFollower('user-2', 'user-target'),
      makeFollower('user-3', 'user-target')
    ])

    const result = await useCase.execute('user-target', 'user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should return followers matching by name (case-insensitive)', async () => {
    repository.seed([
      makeFollower('user-1', 'user-target'),
      makeFollower('user-2', 'user-target')
    ])

    // mock returns name as "Name user-1", "Name user-2" — search "name user-1"
    const result = await useCase.execute('user-target', 'Name user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should return all followers when query matches all', async () => {
    repository.seed([
      makeFollower('user-1', 'user-target'),
      makeFollower('user-2', 'user-target'),
      makeFollower('user-3', 'user-target')
    ])

    const result = await useCase.execute('user-target', 'user')

    expect(result).toHaveLength(3)
  })

  it('should return empty array when no followers match the query', async () => {
    repository.seed([
      makeFollower('user-1', 'user-target'),
      makeFollower('user-2', 'user-target')
    ])

    const result = await useCase.execute('user-target', 'nonexistent')

    expect(result).toHaveLength(0)
  })

  it('should return empty array when user has no followers', async () => {
    const result = await useCase.execute('user-target', 'user')

    expect(result).toHaveLength(0)
  })

  it('should only search among followers of the given user', async () => {
    repository.seed([
      makeFollower('user-1', 'user-target'),
      makeFollower('user-1', 'user-other')
    ])

    const result = await useCase.execute('user-target', 'user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should include name field in results', async () => {
    repository.seed([makeFollower('user-1', 'user-target')])

    const result = await useCase.execute('user-target', 'user-1')

    expect(result[0].name).toBeDefined()
    expect(typeof result[0].name).toBe('string')
  })
})

describe('SearchFollowings', () => {
  let repository: MockFollowersRepository
  let useCase: SearchFollowings

  const makeFollower = (followerId: string, followingId: string): Followers => ({
    id: crypto.randomUUID(),
    followerId,
    followingId,
    createdAt: new Date()
  })

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new SearchFollowings(repository)
  })

  it('should return followings matching by username', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-target', 'user-2'),
      makeFollower('user-target', 'user-3')
    ])

    const result = await useCase.execute('user-target', 'user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should return followings matching by name (case-insensitive)', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-target', 'user-2')
    ])

    const result = await useCase.execute('user-target', 'NAME USER-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should return all followings when query matches all', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-target', 'user-2'),
      makeFollower('user-target', 'user-3')
    ])

    const result = await useCase.execute('user-target', 'user')

    expect(result).toHaveLength(3)
  })

  it('should return empty array when no followings match the query', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-target', 'user-2')
    ])

    const result = await useCase.execute('user-target', 'nonexistent')

    expect(result).toHaveLength(0)
  })

  it('should return empty array when user follows nobody', async () => {
    const result = await useCase.execute('user-target', 'user')

    expect(result).toHaveLength(0)
  })

  it('should only search among followings of the given user', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-other', 'user-1')
    ])

    const result = await useCase.execute('user-target', 'user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should include name field in results', async () => {
    repository.seed([makeFollower('user-target', 'user-1')])

    const result = await useCase.execute('user-target', 'user-1')

    expect(result[0].name).toBeDefined()
    expect(typeof result[0].name).toBe('string')
  })
})
