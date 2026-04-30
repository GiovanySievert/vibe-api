import { UserProfile } from '../mappers'

export interface UserProfileRepository {
  update(userId: string, data: { name: string; bio: string | null }): Promise<UserProfile>
}
