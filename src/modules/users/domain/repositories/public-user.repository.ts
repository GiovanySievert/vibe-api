import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export interface PublicUserRepository {
  getUserById(userId: string): Promise<Users>
  getUserByUsername(username: string, userIdToExclude: string): Promise<Users[]>
}
