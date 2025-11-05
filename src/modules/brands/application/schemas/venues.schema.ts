import { pgTable, integer, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { brands } from './brands.schema'
import { relations } from 'drizzle-orm'
import { venuesLocations } from './venue-locations.schema'

export const venues = pgTable('venues', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  priceRange: varchar('price_range', { length: 5 }),
  paymentMethods: varchar('payment_methods', { length: 255 }),
  socialInstagram: varchar('social_instagram', { length: 255 }),
  socialTiktok: varchar('social_tiktok', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  about: text('about'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})

export const venuesRelations = relations(venues, ({ one }) => ({
  brand: one(brands, {
    fields: [venues.brandId],
    references: [brands.id]
  }),
  location: one(venuesLocations, {
    fields: [venues.id],
    references: [venuesLocations.venueId]
  })
}))
