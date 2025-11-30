import { describe, it, expect, beforeEach } from 'bun:test'
import { GetPublicUserById } from '../../application/use-cases/get-public-user-by-id'
import { MockPublicUserRepository } from '../mocks/public-user.repository.mock'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

describe('GetPublicUserById', () => {
  let repository: MockPublicUserRepository
  let useCase: GetPublicUserById

  beforeEach(() => {
    repository = new MockPublicUserRepository()
    useCase = new GetPublicUserById(repository)
  })

  it('should return user when it exists', async () => {
    const user: Users = {
      id: crypto.randomUUID(),
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      emailVerified: true,
      image: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    repository.seed([user])

    const result = await useCase.execute(user.id)

    expect(result).toBeDefined()
    expect(result.id).toBe(user.id)
    expect(result.name).toBe('John Doe')
    expect(result.username).toBe('johndoe')
    expect(result.email).toBe('john@example.com')
  })

  it('should throw error when user does not exist', async () => {
    const nonExistentId = crypto.randomUUID()

    expect(useCase.execute(nonExistentId)).rejects.toThrow('User not found')
  })

  it('should return correct user when multiple users exist', async () => {
    const users: Users[] = [
      {
        id: crypto.randomUUID(),
        name: 'User One',
        username: 'user1',
        email: 'user1@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'User Two',
        username: 'user2',
        email: 'user2@example.com',
        emailVerified: true,
        image: 'https://example.com/avatar2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: 'User Three',
        username: 'user3',
        email: 'user3@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    repository.seed(users)

    const result = await useCase.execute(users[1].id)

    expect(result.id).toBe(users[1].id)
    expect(result.name).toBe('User Two')
    expect(result.username).toBe('user2')
  })

  it('should handle user with null image', async () => {
    const user: Users = {
      id: crypto.randomUUID(),
      name: 'No Avatar User',
      username: 'noavatar',
      email: 'noavatar@example.com',
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    repository.seed([user])

    const result = await useCase.execute(user.id)

    expect(result.image).toBeNull()
  })

  it('should return user with all correct properties', async () => {
    const now = new Date()
    const user: Users = {
      id: crypto.randomUUID(),
      name: 'Complete User',
      username: 'completeuser',
      email: 'complete@example.com',
      emailVerified: true,
      image: 'https://example.com/complete.jpg',
      createdAt: now,
      updatedAt: now
    }

    repository.seed([user])

    const result = await useCase.execute(user.id)

    expect(result).toEqual(user)
  })
})
