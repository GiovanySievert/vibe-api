import { UserRepository } from '../../domain/repositories/user-repository'

export class MockUserRepository implements UserRepository {
  private usernames: string[] = []

  async existsByUsername(username: string): Promise<boolean> {
    return this.usernames.includes(username)
  }

  reset() {
    this.usernames = []
  }

  seed(usernames: string[]) {
    this.usernames = [...usernames]
  }

  getAll() {
    return [...this.usernames]
  }
}
