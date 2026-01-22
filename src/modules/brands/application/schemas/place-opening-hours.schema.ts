import { pgTable, integer, timestamp, time, boolean, uuid } from 'drizzle-orm/pg-core'
import { places } from './places.schema'

export const placeOpeningHours = pgTable('place_opening_hours', {
  id: uuid('id').defaultRandom().primaryKey(),
  placeId: uuid('place_id')
    .notNull()
    .references(() => places.id, { onDelete: 'cascade' }),

  weekday: integer('weekday').notNull(),
  opensAt: time('opens_at').notNull(),
  closesAt: time('closes_at').notNull(),
  isClosed: boolean('is_closed').notNull().default(false),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})
