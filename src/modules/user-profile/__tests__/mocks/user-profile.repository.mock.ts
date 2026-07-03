import { UserProfile } from '../../domain/mappers'
import { UserProfileRepository } from '../../domain/repositories'

export class MockUserProfileRepository implements UserProfileRepository {
  private profiles: UserProfile[] = []

  async update(
    userId: string,
    data: { name: string; bio: string | null; image?: string | null; imageThumbnail?: string | null }
  ): Promise<UserProfile> {
    const existing = this.profiles.find((p) => p.id === userId)

    if (existing) {
      existing.name = data.name
      existing.bio = data.bio
      existing.image = data.image ?? null
      existing.imageThumbnail = data.imageThumbnail ?? null
      existing.updatedAt = new Date()
      return { ...existing }
    }

    const profile: UserProfile = {
      id: userId,
      name: data.name,
      bio: data.bio,
      image: data.image ?? null,
      imageThumbnail: data.imageThumbnail ?? null,
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
