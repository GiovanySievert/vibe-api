import { pgTable, varchar, timestamp, numeric, uuid } from 'drizzle-orm/pg-core'
import { venues } from './venues.schema'

export const venuesLocations = pgTable('venue_locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  venueId: uuid('venue_id')
    .notNull()
    .references(() => venues.id, { onDelete: 'cascade' }),

  addressLine: varchar('address_line', { length: 255 }).notNull(),
  addressLine2: varchar('address_line_2', { length: 255 }),
  number: varchar('number', { length: 255 }),
  neighborhood: varchar('neighborhood', { length: 255 }),
  city: varchar('city', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  postalCode: varchar('postal_code', { length: 255 }).notNull(),
  lat: numeric('lat', { precision: 9, scale: 6 }).notNull(),
  lng: numeric('lng', { precision: 9, scale: 6 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})
