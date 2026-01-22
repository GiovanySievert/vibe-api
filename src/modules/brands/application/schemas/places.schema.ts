import { pgTable, integer, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { brands } from './brands.schema'
import { relations } from 'drizzle-orm'
import { placeLocations } from './place-locations.schema'

export const places = pgTable('places', {
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
  status: varchar('status', { length: 20 }).notNull().default('pending'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})

export const placesRelations = relations(places, ({ one }) => ({
  brand: one(brands, {
    fields: [places.brandId],
    references: [brands.id]
  }),
  location: one(placeLocations, {
    fields: [places.id],
    references: [placeLocations.placeId]
  })
}))
