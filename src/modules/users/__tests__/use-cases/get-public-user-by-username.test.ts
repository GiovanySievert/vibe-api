import { describe, it, expect, beforeEach } from 'bun:test'
import { GetPublicUserByUsername } from '../../application/use-cases/get-public-user-by-username'
import { MockPublicUserRepository } from '../mocks/public-user.repository.mock'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

describe('GetPublicUserByUsername', () => {
  let repository: MockPublicUserRepository
  let useCase: GetPublicUserByUsername

  beforeEach(() => {
    repository = new MockPublicUserRepository()
    useCase = new GetPublicUserByUsername(repository)
  })

  it('should return users matching username pattern', async () => {
    const users: Users[] = [
      {
        id: crypto.randomUUID(),
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'John Smith',
        username: 'johnsmith',
        email: 'johnsmith@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'Alice Johnson',
        username: 'alice',
        email: 'alice@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)

    const result = await useCase.execute('john', 'non-matching-id')

    expect(result).toHaveLength(2)
    expect(result[0].username).toBe('johndoe')
    expect(result[1].username).toBe('johnsmith')
  })

  it('should exclude specified user id from results', async () => {
    const users: Users[] = [
      {
        id: 'user-1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        name: 'John Smith',
        username: 'johnsmith',
        email: 'johnsmith@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)

    const result = await useCase.execute('john', 'user-1')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('user-2')
    expect(result[0].username).toBe('johnsmith')
  })

  it('should return empty array when no users match', async () => {
    const users: Users[] = [
      {
        id: crypto.randomUUID(),
        name: 'Alice',
        username: 'alice',
        email: 'alice@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)

    const result = await useCase.execute('bob', 'any-id')

    expect(result).toEqual([])
  })

  it('should return empty array when only match is excluded user', async () => {
    const users: Users[] = [
      {
        id: 'user-1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)

    const result = await useCase.execute('john', 'user-1')

    expect(result).toEqual([])
  })

  it('should handle partial username matches', async () => {
    const users: Users[] = [
      {
        id: crypto.randomUUID(),
        name: 'User One',
        username: 'developer',
        email: 'dev@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'User Two',
        username: 'webdeveloper',
        email: 'webdev@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'User Three',
        username: 'designer',
        email: 'designer@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)

    const result = await useCase.execute('dev', 'non-matching-id')

    expect(result).toHaveLength(2)
    expect(result.some((u) => u.username === 'developer')).toBe(true)
    expect(result.some((u) => u.username === 'webdeveloper')).toBe(true)
  })

  it('should return empty array when user list is empty', async () => {
    repository.seed([])

    const result = await useCase.execute('any', 'any-id')

    expect(result).toEqual([])
  })

  it('should maintain user properties in results', async () => {
    const user: Users = {
      id: crypto.randomUUID(),
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      emailVerified: true,
      image: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    repository.seed([user])

    const result = await useCase.execute('test', 'different-id')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(user.id)
    expect(result[0].name).toBe('Test User')
    expect(result[0].email).toBe('test@example.com')
    expect(result[0].emailVerified).toBe(true)
    expect(result[0].image).toBe('https://example.com/avatar.jpg')
  })

  it('should exclude users who have blocked the logged user', async () => {
    const users: Users[] = [
      {
        id: 'user-1',
        name: 'User One',
        username: 'userone',
        email: 'user1@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        name: 'User Two',
        username: 'usertwo',
        email: 'user2@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)
    repository.addBlock('user-1', 'logged-user-id')

    const result = await useCase.execute('user', 'logged-user-id')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('user-2')
    expect(result[0].username).toBe('usertwo')
  })

  it('should include users that logged user has blocked', async () => {
    const users: Users[] = [
      {
        id: 'user-1',
        name: 'User One',
        username: 'userone',
        email: 'user1@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        name: 'User Two',
        username: 'usertwo',
        email: 'user2@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)
    repository.addBlock('logged-user-id', 'user-1')

    const result = await useCase.execute('user', 'logged-user-id')

    expect(result).toHaveLength(2)
    expect(result.some((u) => u.id === 'user-1')).toBe(true)
    expect(result.some((u) => u.id === 'user-2')).toBe(true)
  })

  it('should handle multiple blocks correctly', async () => {
    const users: Users[] = [
      {
        id: 'user-1',
        name: 'User One',
        username: 'userone',
        email: 'user1@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        name: 'User Two',
        username: 'usertwo',
        email: 'user2@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-3',
        name: 'User Three',
        username: 'userthree',
        email: 'user3@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)
    repository.addBlock('user-1', 'logged-user-id')
    repository.addBlock('user-3', 'logged-user-id')

    const result = await useCase.execute('user', 'logged-user-id')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('user-2')
  })
})
