export type AdminUser = {
  id: string
  name: string | null
  username: string | null
  email: string
  emailVerified: boolean | null
  image: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

export type ListAdminUsersInput = {
  searchValue?: string
  limit: number
  offset: number
}

export type ListAdminUsersResult = {
  users: AdminUser[]
  total: number
  limit: number
  offset: number
}

export interface AdminUsersRepository {
  list(input: ListAdminUsersInput): Promise<ListAdminUsersResult>
  findById(userId: string): Promise<AdminUser | null>
  ban(userId: string, reason: string | null): Promise<AdminUser | null>
  unban(userId: string): Promise<AdminUser | null>
  deleteSessions(userId: string): Promise<void>
}
