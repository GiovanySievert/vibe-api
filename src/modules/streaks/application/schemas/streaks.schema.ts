import { users } from '@src/infra/database/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, index, integer, pgTable, smallint, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

export const userStreaks = pgTable('user_streaks', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActiveWeek: smallint('last_active_week'),
  lastActiveYear: smallint('last_active_year'),
  weeklyThreshold: smallint('weekly_threshold').notNull().default(2),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
})

export const userWeeklyActivity = pgTable(
  'user_weekly_activity',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    isoYear: smallint('iso_year').notNull(),
    isoWeek: smallint('iso_week').notNull(),
    reviewCount: integer('review_count').notNull().default(0),
    streakContributed: boolean('streak_contributed').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    unique().on(table.userId, table.isoYear, table.isoWeek),
    index('weekly_activity_user_idx').on(table.userId),
    index('weekly_activity_week_idx').on(table.isoYear, table.isoWeek)
  ]
)

export type UserStreakSelect = InferSelectModel<typeof userStreaks>
export type UserStreakInsert = InferInsertModel<typeof userStreaks>
export type UserWeeklyActivitySelect = InferSelectModel<typeof userWeeklyActivity>
export type UserWeeklyActivityInsert = InferInsertModel<typeof userWeeklyActivity>
