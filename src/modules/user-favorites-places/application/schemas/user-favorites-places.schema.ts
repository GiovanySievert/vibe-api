import { pgTable, integer, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { users, places } from '@src/infra/database/schema'

export const userFavoritesPlaces = pgTable(
  'user_favorites_places',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    placeId: uuid('place_id')
      .notNull()
      .references(() => places.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [unique().on(table.userId, table.placeId)]
)
