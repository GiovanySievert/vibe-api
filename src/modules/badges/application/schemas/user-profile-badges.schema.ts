import { places, users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm'
import { check, integer, pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

export const userProfileBadges = pgTable(
  'user_profile_badges',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    selectedAt: timestamp('selected_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    unique('user_profile_badges_user_place_unique').on(table.userId, table.placeId),
    unique('user_profile_badges_user_position_unique').on(table.userId, table.position),
    check('user_profile_badges_position_check', sql`${table.position} between 1 and 3`)
  ]
)

export type UserProfileBadgeSelect = InferSelectModel<typeof userProfileBadges>
export type UserProfileBadgeInsert = InferInsertModel<typeof userProfileBadges>
