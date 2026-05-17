import { BanAdminUser, ListAdminUsers, UnbanAdminUser } from '../../../application/use-cases'

type ListContext = {
  query: {
    searchValue?: string
    limit?: number
    offset?: number
  }
}

type BanContext = {
  params: {
    userId: string
  }
  body: {
    banReason?: string
  }
  status: (code: number, body?: unknown) => unknown
}

type UnbanContext = {
  params: {
    userId: string
  }
  status: (code: number, body?: unknown) => unknown
}

export class AdminUsersController {
  constructor(
    private readonly listAdminUsers: ListAdminUsers,
    private readonly banAdminUser: BanAdminUser,
    private readonly unbanAdminUser: UnbanAdminUser
  ) {}

  async list({ query }: ListContext) {
    return await this.listAdminUsers.execute({
      searchValue: query.searchValue,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0
    })
  }

  async ban({ params, body, status }: BanContext) {
    const result = await this.banAdminUser.execute(params.userId, body.banReason ?? null)
    if (!result) return status(404, { message: 'User not found' })
    if (result === 'admin-user') return status(403, { message: 'Admin users cannot be banned' })
    return result
  }

  async unban({ params, status }: UnbanContext) {
    const result = await this.unbanAdminUser.execute(params.userId)
    if (!result) return status(404, { message: 'User not found' })
    return result
  }
}
