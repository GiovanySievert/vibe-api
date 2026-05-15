import { describe, it, expect, beforeEach } from 'bun:test'
import { SearchFollowings } from '../../application/use-cases/followers/search-followings'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { Followers } from '../../domain/mappers'

describe('SearchFollowings - extended coverage', () => {
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

  it('should return all followings when query is empty string', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-target', 'user-2')
    ])

    const result = await useCase.execute('user-target', '')

    expect(result).toHaveLength(2)
  })

  it('should be case-insensitive when matching by username', async () => {
    repository.seed([makeFollower('user-target', 'user-1')])

    const result = await useCase.execute('user-target', 'USER-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should respect pagination limit', async () => {
    const seed: Followers[] = []
    for (let i = 0; i < 5; i++) seed.push(makeFollower('user-target', `user-${i}`))
    repository.seed(seed)

    const result = await useCase.execute('user-target', 'user', 1, 2)

    expect(result).toHaveLength(2)
  })

  it('should paginate correctly across pages', async () => {
    const seed: Followers[] = []
    for (let i = 0; i < 5; i++) seed.push(makeFollower('user-target', `user-${i}`))
    repository.seed(seed)

    const page1 = await useCase.execute('user-target', 'user', 1, 2)
    const page2 = await useCase.execute('user-target', 'user', 2, 2)
    const page3 = await useCase.execute('user-target', 'user', 3, 2)

    expect(page1).toHaveLength(2)
    expect(page2).toHaveLength(2)
    expect(page3).toHaveLength(1)
    const collected = new Set([
      page1[0].userId,
      page1[1].userId,
      page2[0].userId,
      page2[1].userId,
      page3[0].userId
    ])
    expect(collected.size).toBe(5)
  })

  it('should return empty array when page is beyond available results', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('user-target', 'user-2')
    ])

    const result = await useCase.execute('user-target', 'user', 10, 5)

    expect(result).toHaveLength(0)
  })

  it('should not include followings from other users', async () => {
    repository.seed([
      makeFollower('user-target', 'user-1'),
      makeFollower('other-user', 'user-2'),
      makeFollower('other-user', 'user-3')
    ])

    const result = await useCase.execute('user-target', 'user')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-1')
  })

  it('should propagate repository error', async () => {
    const failingRepo = {
      searchFollowings: async () => {
        throw new Error('search failed')
      }
    } as unknown as ConstructorParameters<typeof SearchFollowings>[0]

    const failingUseCase = new SearchFollowings(failingRepo)

    await expect(failingUseCase.execute('user-target', 'q')).rejects.toThrow('search failed')
  })
})
