import { AdminUser, AdminUsersRepository } from '../../domain/repositories'

export class UnbanAdminUser {
  constructor(private readonly adminUsersRepository: AdminUsersRepository) {}

  async execute(userId: string): Promise<AdminUser | null> {
    return await this.adminUsersRepository.unban(userId)
  }
}
