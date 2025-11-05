import { users } from '@src/infra/database/schema'
import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

export const followStats = pgTable('follow-stats', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  followersCount: integer('followers_count').notNull().default(0),
  followingCount: integer('following_count').notNull().default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})
