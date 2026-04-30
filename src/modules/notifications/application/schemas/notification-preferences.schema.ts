import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, pgTable, primaryKey, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 64 }).notNull(),
    pushEnabled: boolean('push_enabled').notNull().default(true),
    inAppEnabled: boolean('in_app_enabled').notNull().default(true),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [primaryKey({ columns: [table.userId, table.type] })]
)

export type NotificationPreferencesSelect = InferSelectModel<typeof notificationPreferences>
export type NotificationPreferencesInsert = InferInsertModel<typeof notificationPreferences>
