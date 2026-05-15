import { UserRepository } from '../../domain/repositories/user-repository'

type UserRecord = { id: string; username: string }

export class MockUserRepository implements UserRepository {
  private records: UserRecord[] = []

  async existsByUsername(username: string): Promise<boolean> {
    return this.records.some((record) => record.username === username)
  }

  async findUsernameOwnerId(username: string): Promise<string | null> {
    const match = this.records.find((record) => record.username === username)
    return match?.id ?? null
  }

  async updateUsername(userId: string, username: string): Promise<void> {
    const target = this.records.find((record) => record.id === userId)
    if (target) {
      target.username = username
      return
    }
    this.records.push({ id: userId, username })
  }

  reset() {
    this.records = []
  }

  seed(input: string[] | UserRecord[]) {
    if (input.length === 0) {
      this.records = []
      return
    }
    if (typeof input[0] === 'string') {
      this.records = (input as string[]).map((username) => ({ id: crypto.randomUUID(), username }))
      return
    }
    this.records = [...(input as UserRecord[])]
  }

  getAll(): UserRecord[] {
    return [...this.records]
  }
}
