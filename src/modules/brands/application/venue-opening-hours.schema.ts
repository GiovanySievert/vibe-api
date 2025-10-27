import { pgTable, integer, timestamp, time, boolean } from 'drizzle-orm/pg-core'
import { venues } from './venues.schema'

export const venueOpeningHours = pgTable('venue_opening_hours', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  venueId: integer('venue_id')
    .notNull()
    .references(() => venues.id, { onDelete: 'cascade' }),

  weekday: integer('weekday').notNull(),
  opensAt: time('opens_at').notNull(),
  closesAt: time('closes_at').notNull(),
  isClosed: boolean('is_closed').notNull().default(false),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})
