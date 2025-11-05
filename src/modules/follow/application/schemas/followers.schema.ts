import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, unique, index } from 'drizzle-orm/pg-core'

export const followers = pgTable(
  'followers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    unique().on(table.followerId, table.followingId),
    index('follower_idx').on(table.followerId),
    index('following_idx').on(table.followingId)
  ]
)

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
    relationName: 'follower'
  }),
  following: one(users, {
    fields: [followers.followingId],
    references: [users.id],
    relationName: 'following'
  })
}))

export type FollowersSelect = InferSelectModel<typeof followers>
export type FollowersInsert = InferInsertModel<typeof followers>
