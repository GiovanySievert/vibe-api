import { describe, it, expect, beforeEach } from 'bun:test'
import { UpdateUserProfile } from '../../application/use-cases'
import { MockUserProfileRepository } from '../mocks/user-profile.repository.mock'

describe('UpdateUserProfile', () => {
  let updateUserProfile: UpdateUserProfile
  let mockUserProfileRepo: MockUserProfileRepository

  beforeEach(() => {
    mockUserProfileRepo = new MockUserProfileRepository()
    updateUserProfile = new UpdateUserProfile(mockUserProfileRepo)
  })

  it('should update user profile successfully with name and bio', async () => {
    const userId = crypto.randomUUID()
    const data = { name: 'John Doe', bio: 'Software developer' }

    const result = await updateUserProfile.execute(userId, data)

    expect(result).toBeDefined()
    expect(result.id).toBe(userId)
    expect(result.name).toBe(data.name)
    expect(result.bio).toBe(data.bio)
    expect(result.updatedAt).toBeInstanceOf(Date)
  })

  it('should update user profile with null bio', async () => {
    const userId = crypto.randomUUID()
    const data = { name: 'Jane Doe', bio: null }

    const result = await updateUserProfile.execute(userId, data)

    expect(result).toBeDefined()
    expect(result.id).toBe(userId)
    expect(result.name).toBe('Jane Doe')
    expect(result.bio).toBeNull()
  })

  it('should persist the updated profile in the repository', async () => {
    const userId = crypto.randomUUID()

    await updateUserProfile.execute(userId, { name: 'Initial Name', bio: 'Initial bio' })
    await updateUserProfile.execute(userId, { name: 'Updated Name', bio: 'Updated bio' })

    const profiles = mockUserProfileRepo.getAll()
    expect(profiles).toHaveLength(1)
    expect(profiles[0].name).toBe('Updated Name')
    expect(profiles[0].bio).toBe('Updated bio')
  })

  it('should allow updating profile for different users independently', async () => {
    const userId1 = crypto.randomUUID()
    const userId2 = crypto.randomUUID()

    await updateUserProfile.execute(userId1, { name: 'User One', bio: null })
    await updateUserProfile.execute(userId2, { name: 'User Two', bio: 'Bio two' })

    const profiles = mockUserProfileRepo.getAll()
    expect(profiles).toHaveLength(2)
  })
})
