import { AdminUser, AdminUsersRepository } from '../../domain/repositories'

const hasAdminRole = (role?: string | null) =>
  (role ?? '')
    .split(',')
    .map((value) => value.trim())
    .includes('admin')

export class BanAdminUser {
  constructor(private readonly adminUsersRepository: AdminUsersRepository) {}

  async execute(userId: string, reason: string | null): Promise<AdminUser | null | 'admin-user'> {
    const user = await this.adminUsersRepository.findById(userId)
    if (!user) return null
    if (hasAdminRole(user.role)) return 'admin-user'

    const bannedUser = await this.adminUsersRepository.ban(userId, reason)
    await this.adminUsersRepository.deleteSessions(userId)

    return bannedUser
  }
}
