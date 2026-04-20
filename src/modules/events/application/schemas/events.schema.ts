import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, uuid, varchar, text, timestamp, date, time } from 'drizzle-orm/pg-core'
import { eventParticipants } from './event-participants.schema'

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 60 }).notNull(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const eventsRelations = relations(events, ({ one, many }) => ({
  owner: one(users, {
    fields: [events.ownerId],
    references: [users.id]
  }),
  participants: many(eventParticipants)
}))

export type EventsSelect = InferSelectModel<typeof events>
export type EventsInsert = InferInsertModel<typeof events>
