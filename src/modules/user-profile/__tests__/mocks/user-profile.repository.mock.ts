import { UserProfile } from '../../domain/mappers'
import { UserProfileRepository } from '../../domain/repositories'

export class MockUserProfileRepository implements UserProfileRepository {
  private profiles: UserProfile[] = []

  async update(userId: string, data: { name: string; bio: string | null }): Promise<UserProfile> {
    const existing = this.profiles.find((p) => p.id === userId)

    if (existing) {
      existing.name = data.name
      existing.bio = data.bio
      existing.updatedAt = new Date()
      return { ...existing }
    }

    const profile: UserProfile = {
      id: userId,
      name: data.name,
      bio: data.bio,
      updatedAt: new Date()
    }
    this.profiles.push(profile)
    return { ...profile }
  }

  reset() {
    this.profiles = []
  }

  seed(data: UserProfile[]) {
    this.profiles = [...data]
  }

  getAll() {
    return [...this.profiles]
  }
}
