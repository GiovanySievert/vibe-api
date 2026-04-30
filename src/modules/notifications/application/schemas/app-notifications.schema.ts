import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { index, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const appNotifications = pgTable(
  'app_notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 64 }).notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    data: jsonb('data').$type<Record<string, unknown>>().notNull().default({}),
    readAt: timestamp('read_at', { mode: 'date' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    index('app_notifications_user_created_idx').on(table.userId, table.createdAt),
    index('app_notifications_user_read_idx').on(table.userId, table.readAt)
  ]
)

export type AppNotificationsSelect = InferSelectModel<typeof appNotifications>
export type AppNotificationsInsert = InferInsertModel<typeof appNotifications>
