import { describe, it, expect, beforeEach } from 'bun:test'
import { DeleteFollower } from '../../application/use-cases/followers/delete-follower'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { Followers } from '../../domain/mappers'

describe('DeleteFollower', () => {
  let repository: MockFollowersRepository
  let useCase: DeleteFollower

  beforeEach(() => {
    repository = new MockFollowersRepository()
    useCase = new DeleteFollower(repository)
  })

  it('should delete a follower relationship', async () => {
    const follower: Followers = {
      id: crypto.randomUUID(),
      followerId: 'user-1',
      followingId: 'user-2',
      createdAt: new Date()
    }

    repository.seed([follower])

    await useCase.execute(follower.id)

    const followers = repository.getAll()
    expect(followers).toHaveLength(0)
  })

  it('should remove only the specified follower', async () => {
    const followers: Followers[] = [
      {
        id: 'follow-1',
        followerId: 'user-1',
        followingId: 'user-2',
        createdAt: new Date()
      },
      {
        id: 'follow-2',
        followerId: 'user-1',
        followingId: 'user-3',
        createdAt: new Date()
      },
      {
        id: 'follow-3',
        followerId: 'user-2',
        followingId: 'user-3',
        createdAt: new Date()
      }
    ]

    repository.seed(followers)

    await useCase.execute('follow-2')

    const remaining = repository.getAll()
    expect(remaining).toHaveLength(2)
    expect(remaining.find((f) => f.id === 'follow-1')).toBeDefined()
    expect(remaining.find((f) => f.id === 'follow-3')).toBeDefined()
    expect(remaining.find((f) => f.id === 'follow-2')).toBeUndefined()
  })

  it('should not throw error when deleting non-existent follower', async () => {
    await useCase.execute('non-existent-id')
    expect(true).toBe(true)
  })
})
