import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar, unique, index } from 'drizzle-orm/pg-core'

export const followRequests = pgTable(
  'follow_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    requesterId: uuid('requester_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    requestedId: uuid('requested_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    unique().on(table.requesterId, table.requestedId),
    index('requested_status_idx').on(table.requestedId, table.status)
  ]
)

export const followRequestsRelations = relations(followRequests, ({ one }) => ({
  requester: one(users, {
    fields: [followRequests.requesterId],
    references: [users.id],
    relationName: 'requester'
  }),
  requested: one(users, {
    fields: [followRequests.requestedId],
    references: [users.id],
    relationName: 'requested'
  })
}))

export type FollowRequestsSelect = InferSelectModel<typeof followRequests>
export type FollowRequestsInsert = InferInsertModel<typeof followRequests>
