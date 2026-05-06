import { users, places } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, text, index, pgEnum, unique, boolean } from 'drizzle-orm/pg-core'

export const placeReviewTypeEnum = pgEnum('place_review_type', ['crowded', 'dead'])
export const placeReviewReactionTypeEnum = pgEnum('place_review_reaction_type', ['on', 'off'])

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
    placeName: text('place_name').notNull().default(''),
    rating: placeReviewTypeEnum('rating').notNull(),
    placeImageUrl: text('image_url'),
    selfieUrl: text('selfie_url'),
    selfieFriendsOnly: boolean('selfie_friends_only').default(false).notNull(),
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

export const placeReviewComments = pgTable(
  'place_review_comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    reviewId: uuid('review_id')
      .notNull()
      .references(() => placeReviews.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [index('place_review_comment_review_idx').on(table.reviewId)]
)

export const placeReviewCommentsRelations = relations(placeReviewComments, ({ one }) => ({
  review: one(placeReviews, {
    fields: [placeReviewComments.reviewId],
    references: [placeReviews.id]
  }),
  user: one(users, {
    fields: [placeReviewComments.userId],
    references: [users.id]
  })
}))

export const placeReviewReactions = pgTable(
  'place_review_reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    reviewId: uuid('review_id')
      .notNull()
      .references(() => placeReviews.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: placeReviewReactionTypeEnum('type').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    index('place_review_reaction_review_idx').on(table.reviewId),
    index('place_review_reaction_user_idx').on(table.userId),
    unique().on(table.reviewId, table.userId)
  ]
)

export const placeReviewReactionsRelations = relations(placeReviewReactions, ({ one }) => ({
  review: one(placeReviews, {
    fields: [placeReviewReactions.reviewId],
    references: [placeReviews.id]
  }),
  user: one(users, {
    fields: [placeReviewReactions.userId],
    references: [users.id]
  })
}))

export type PlaceReviewSelect = InferSelectModel<typeof placeReviews>
export type PlaceReviewInsert = InferInsertModel<typeof placeReviews>
export type PlaceReviewCommentSelect = InferSelectModel<typeof placeReviewComments>
export type PlaceReviewCommentInsert = InferInsertModel<typeof placeReviewComments>
export type PlaceReviewReactionSelect = InferSelectModel<typeof placeReviewReactions>
export type PlaceReviewReactionInsert = InferInsertModel<typeof placeReviewReactions>
export type PlaceReviewType = (typeof placeReviewTypeEnum.enumValues)[number]
export type PlaceReviewReactionType = (typeof placeReviewReactionTypeEnum.enumValues)[number]
