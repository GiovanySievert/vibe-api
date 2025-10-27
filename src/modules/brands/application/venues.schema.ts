import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { brands } from './brands.schema'

export const venues = pgTable('venues', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  brandId: integer('brand_id')
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
