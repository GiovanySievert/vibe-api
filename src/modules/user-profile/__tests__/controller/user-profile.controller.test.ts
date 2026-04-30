import { describe, it, expect, beforeEach } from 'bun:test'
import { UserProfileController } from '../../infrastructure/http/controllers'
import { UpdateUserProfile } from '../../application/use-cases'
import { MockUserProfileRepository } from '../mocks/user-profile.repository.mock'
import { User } from 'better-auth/types'

const makeUser = (id: string): User =>
  ({ id, name: 'Test User', email: 'test@example.com' }) as User

describe('UserProfileController', () => {
  let controller: UserProfileController
  let repository: MockUserProfileRepository

  beforeEach(() => {
    repository = new MockUserProfileRepository()
    const updateUserProfile = new UpdateUserProfile(repository)
    controller = new UserProfileController(updateUserProfile)
  })

  describe('update', () => {
    it('should update profile with name and bio', async () => {
      const user = makeUser(crypto.randomUUID())
      const body = { name: 'New Name', bio: 'New bio' }

      const result = await controller.update({ body, user })

      expect(result).toBeDefined()
      expect(result.id).toBe(user.id)
      expect(result.name).toBe(body.name)
      expect(result.bio).toBe(body.bio)
    })

    it('should update profile with name only, bio defaults to null', async () => {
      const user = makeUser(crypto.randomUUID())
      const body = { name: 'Only Name' }

      const result = await controller.update({ body, user })

      expect(result).toBeDefined()
      expect(result.name).toBe('Only Name')
      expect(result.bio).toBeNull()
    })

    it('should use authenticated user id from context', async () => {
      const userId = crypto.randomUUID()
      const user = makeUser(userId)
      const body = { name: 'My Name', bio: 'My bio' }

      await controller.update({ body, user })

      const profiles = repository.getAll()
      expect(profiles).toHaveLength(1)
      expect(profiles[0].id).toBe(userId)
    })

    it('should return updated date on result', async () => {
      const user = makeUser(crypto.randomUUID())
      const body = { name: 'Name', bio: null }

      const result = await controller.update({ body, user })

      expect(result.updatedAt).toBeInstanceOf(Date)
    })
  })
})
