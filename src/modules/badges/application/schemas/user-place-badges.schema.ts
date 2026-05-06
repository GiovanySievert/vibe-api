import { users, places } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, timestamp, uuid, index, pgEnum, unique } from 'drizzle-orm/pg-core'

export const placeReviewBadgeTierEnum = pgEnum('place_review_badge_tier', [
  'regular',
  'frequent',
  'king'
])

export const userPlaceBadges = pgTable(
  'user_place_badges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    tier: placeReviewBadgeTierEnum('tier').notNull(),
    achievedAt: timestamp('achieved_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    unique().on(table.userId, table.placeId, table.tier),
    index('user_place_badges_user_idx').on(table.userId),
    index('user_place_badges_place_idx').on(table.placeId)
  ]
)

export type UserPlaceBadgeSelect = InferSelectModel<typeof userPlaceBadges>
export type UserPlaceBadgeInsert = InferInsertModel<typeof userPlaceBadges>
