import { count, desc, eq, ilike } from 'drizzle-orm'
import { db } from '@src/infra/database/client'
import { sessions, users } from '@src/infra/database/schema'
import { AdminUser, AdminUsersRepository, ListAdminUsersInput, ListAdminUsersResult } from '../../domain/repositories'

const defaultBanReason = 'Blocked from admin panel'

const selectUser = {
  id: users.id,
  name: users.name,
  username: users.username,
  email: users.email,
  emailVerified: users.emailVerified,
  image: users.image,
  role: users.role,
  banned: users.banned,
  banReason: users.banReason,
  banExpires: users.banExpires,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt
}

export class DrizzleAdminUsersRepository implements AdminUsersRepository {
  async list(input: ListAdminUsersInput): Promise<ListAdminUsersResult> {
    const search = input.searchValue?.trim()
    const where = search ? ilike(users.email, `%${search}%`) : undefined

    const [totalRow] = await db.select({ value: count() }).from(users).where(where)
    const rows = await db
      .select(selectUser)
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(input.limit)
      .offset(input.offset)

    return {
      users: rows,
      total: Number(totalRow?.value ?? 0),
      limit: input.limit,
      offset: input.offset
    }
  }

  async findById(userId: string): Promise<AdminUser | null> {
    const [user] = await db.select(selectUser).from(users).where(eq(users.id, userId)).limit(1)
    return user ?? null
  }

  async ban(userId: string, reason: string | null): Promise<AdminUser | null> {
    const [user] = await db
      .update(users)
      .set({
        banned: true,
        banReason: reason?.trim() || defaultBanReason,
        banExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning(selectUser)

    return user ?? null
  }

  async unban(userId: string): Promise<AdminUser | null> {
    const [user] = await db
      .update(users)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning(selectUser)

    return user ?? null
  }

  async deleteSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId))
  }
}
