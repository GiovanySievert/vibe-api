import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core'

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
