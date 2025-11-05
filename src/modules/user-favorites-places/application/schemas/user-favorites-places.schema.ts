import { pgTable, integer, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { users, venues } from '@src/infra/database/schema'

export const userFavoritesPlaces = pgTable(
  'user_favorites_places',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    venueId: uuid('venue_id')
      .notNull()
      .references(() => venues.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [unique().on(table.userId, table.venueId)]
)
