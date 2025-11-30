import { PublicUserRepository } from '../../domain/repositories'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

export class MockPublicUserRepository implements PublicUserRepository {
  private users: Users[] = []

  async getUserById(userId: string): Promise<Users> {
    const user = this.users.find((u) => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async getUserByUsername(username: string, userIdToExclude: string): Promise<Users[]> {
    return this.users.filter((u) => u.username.includes(username) && u.id !== userIdToExclude)
  }

  reset() {
    this.users = []
  }

  seed(users: Users[]) {
    this.users = [...users]
  }

  getAll() {
    return [...this.users]
  }
}
