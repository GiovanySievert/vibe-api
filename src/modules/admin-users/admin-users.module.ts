import { BanAdminUser, ListAdminUsers, UnbanAdminUser } from './application/use-cases'
import { AdminUsersController } from './infrastructure/http/controllers'
import { DrizzleAdminUsersRepository } from './infrastructure/persistence'

export class AdminUsersModule {
  public readonly adminUsersController: AdminUsersController

  constructor() {
    const adminUsersRepository = new DrizzleAdminUsersRepository()
    const listAdminUsers = new ListAdminUsers(adminUsersRepository)
    const banAdminUser = new BanAdminUser(adminUsersRepository)
    const unbanAdminUser = new UnbanAdminUser(adminUsersRepository)

    this.adminUsersController = new AdminUsersController(listAdminUsers, banAdminUser, unbanAdminUser)
  }
}
