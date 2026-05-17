import { AdminUsersRepository, ListAdminUsersInput, ListAdminUsersResult } from '../../domain/repositories'

export class ListAdminUsers {
  constructor(private readonly adminUsersRepository: AdminUsersRepository) {}

  async execute(input: ListAdminUsersInput): Promise<ListAdminUsersResult> {
    return await this.adminUsersRepository.list(input)
  }
}
