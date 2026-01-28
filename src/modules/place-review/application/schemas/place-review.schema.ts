import { users, places } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, text, integer, index } from 'drizzle-orm/pg-core'

export const placeReviews = pgTable(
  'place_reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    index('place_review_user_idx').on(table.userId),
    index('place_review_place_idx').on(table.placeId)
  ]
)

export const placeReviewsRelations = relations(placeReviews, ({ one }) => ({
  user: one(users, {
    fields: [placeReviews.userId],
    references: [users.id]
  }),
  place: one(places, {
    fields: [placeReviews.placeId],
    references: [places.id]
  })
}))

export type PlaceReviewSelect = InferSelectModel<typeof placeReviews>
export type PlaceReviewInsert = InferInsertModel<typeof placeReviews>
