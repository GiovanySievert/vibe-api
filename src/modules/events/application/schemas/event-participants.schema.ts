import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgEnum, pgTable, uuid, timestamp, unique } from 'drizzle-orm/pg-core'
import { events } from './events.schema'

export const eventParticipantStatusEnum = pgEnum('event_participant_status', ['pending', 'accepted', 'declined'])

export const eventParticipants = pgTable(
  'event_participants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: eventParticipantStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull()
  },
  (table) => [unique().on(table.eventId, table.userId)]
)

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(events, {
    fields: [eventParticipants.eventId],
    references: [events.id]
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id]
  })
}))

export type EventParticipantsSelect = InferSelectModel<typeof eventParticipants>
export type EventParticipantsInsert = InferInsertModel<typeof eventParticipants>
