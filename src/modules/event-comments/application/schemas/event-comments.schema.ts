import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from '@src/modules/auth/application/schemas'
import { events } from '@src/modules/events/application/schemas'

export const eventComments = pgTable('event_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const eventCommentsRelations = relations(eventComments, ({ one }) => ({
  event: one(events, {
    fields: [eventComments.eventId],
    references: [events.id]
  }),
  user: one(users, {
    fields: [eventComments.userId],
    references: [users.id]
  })
}))

export type EventCommentsSelect = InferSelectModel<typeof eventComments>
export type EventCommentsInsert = InferInsertModel<typeof eventComments>
