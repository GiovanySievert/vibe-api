import { pgTable, integer, varchar, timestamp, uuid } from 'drizzle-orm/pg-core'
import { brands } from './brands.schema'
import { relations } from 'drizzle-orm'

export const brandMenus = pgTable('brand_menus', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  priceCents: integer('price_cents').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})

export const brandMenusRelations = relations(brandMenus, ({ one }) => ({
  brand: one(brands, {
    fields: [brandMenus.brandId],
    references: [brands.id]
  })
}))
