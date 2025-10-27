import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core'

export const brands = pgTable('brands', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  taxId: varchar('tax_id', { length: 14 }).notNull(),
  type: varchar('type', { length: 255 }),
  avatar: varchar('avatar', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})

export type BrandsSelect = InferSelectModel<typeof brands>
export type BrandsInsert = InferInsertModel<typeof brands>
