import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export interface PublicUserRepository {
  getUserById(userId: string, loggedUserId: string): Promise<Users | null>
  getUserByUsername(username: string, userIdToExclude: string): Promise<Users[]>
}
