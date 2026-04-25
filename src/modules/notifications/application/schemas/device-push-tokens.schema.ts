import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const devicePushTokens = pgTable(
  'device_push_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    platform: varchar('platform', { length: 20 }).notNull(),
    deviceId: text('device_id'),
    appBuild: varchar('app_build', { length: 50 }),
    permissionStatus: varchar('permission_status', { length: 20 }).notNull().default('granted'),
    isActive: boolean('is_active').notNull().default(true),
    lastSeenAt: timestamp('last_seen_at', { mode: 'date' }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    index('device_push_tokens_user_idx').on(table.userId),
    index('device_push_tokens_user_active_idx').on(table.userId, table.isActive)
  ]
)

export type DevicePushTokensSelect = InferSelectModel<typeof devicePushTokens>
export type DevicePushTokensInsert = InferInsertModel<typeof devicePushTokens>
