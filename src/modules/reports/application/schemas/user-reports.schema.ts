import { pgTable, uuid, timestamp, text, pgEnum, unique } from 'drizzle-orm/pg-core'

export const reportReasonEnum = pgEnum('report_reason', [
  'spam',
  'inappropriate_content',
  'harassment',
  'fake_account',
  'other'
])

export const userReports = pgTable(
  'user_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reporterId: uuid('reporter_id').notNull(),
    reportedId: uuid('reported_id').notNull(),
    reason: reportReasonEnum('reason').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  (table) => [unique().on(table.reporterId, table.reportedId)]
)

export type ReportReason = (typeof reportReasonEnum.enumValues)[number]
