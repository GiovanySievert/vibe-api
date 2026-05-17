import {
  AdminUser,
  AdminUsersRepository,
  ListAdminUsersInput,
  ListAdminUsersResult
} from '../../domain/repositories'

const now = new Date('2026-01-01T00:00:00.000Z')

export const makeAdminUser = (overrides: Partial<AdminUser> = {}): AdminUser => ({
  id: 'user-1',
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  emailVerified: true,
  image: null,
  role: 'user',
  banned: false,
  banReason: null,
  banExpires: null,
  createdAt: now,
  updatedAt: now,
  ...overrides
})

export class MockAdminUsersRepository implements AdminUsersRepository {
  private users: AdminUser[] = []
  public lastListInput: ListAdminUsersInput | null = null
  public bannedUserIds: string[] = []
  public unbannedUserIds: string[] = []
  public deletedSessionUserIds: string[] = []

  async list(input: ListAdminUsersInput): Promise<ListAdminUsersResult> {
    this.lastListInput = input

    const search = input.searchValue?.trim().toLowerCase()
    const filtered = search ? this.users.filter((user) => user.email.toLowerCase().includes(search)) : this.users

    return {
      users: filtered.slice(input.offset, input.offset + input.limit),
      total: filtered.length,
      limit: input.limit,
      offset: input.offset
    }
  }

  async findById(userId: string): Promise<AdminUser | null> {
    return this.users.find((user) => user.id === userId) ?? null
  }

  async ban(userId: string, reason: string | null): Promise<AdminUser | null> {
    this.bannedUserIds.push(userId)
    const user = await this.findById(userId)
    if (!user) return null

    const bannedUser = {
      ...user,
      banned: true,
      banReason: reason,
      banExpires: null,
      updatedAt: now
    }
    this.users = this.users.map((current) => current.id === userId ? bannedUser : current)
    return bannedUser
  }

  async unban(userId: string): Promise<AdminUser | null> {
    this.unbannedUserIds.push(userId)
    const user = await this.findById(userId)
    if (!user) return null

    const unbannedUser = {
      ...user,
      banned: false,
      banReason: null,
      banExpires: null,
      updatedAt: now
    }
    this.users = this.users.map((current) => current.id === userId ? unbannedUser : current)
    return unbannedUser
  }

  async deleteSessions(userId: string): Promise<void> {
    this.deletedSessionUserIds.push(userId)
  }

  seed(users: AdminUser[]) {
    this.users = [...users]
  }
}
