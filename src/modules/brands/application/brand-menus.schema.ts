import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core'
import { brands } from './brands.schema'

export const brandsMenus = pgTable('brands_menu_items', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  brandId: integer('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  priceCents: integer('price_cents').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})
