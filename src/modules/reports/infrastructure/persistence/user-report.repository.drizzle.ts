import { db } from '@src/infra/database/client'
import { and, eq } from 'drizzle-orm'
import { ReportReason, userReports } from '../../application/schemas'
import { UserReport } from '../../domain/mappers'
import { UserReportRepository } from '../../domain/repositories'

export class DrizzleUserReportRepository implements UserReportRepository {
  async create(reporterId: string, reportedId: string, reason: string, description: string | null): Promise<UserReport> {
    const [result] = await db
      .insert(userReports)
      .values({ reporterId, reportedId, reason: reason as ReportReason, description })
      .returning()

    return result
  }

  async findReport(reporterId: string, reportedId: string): Promise<UserReport | null> {
    const [result] = await db
      .select()
      .from(userReports)
      .where(and(eq(userReports.reporterId, reporterId), eq(userReports.reportedId, reportedId)))
      .limit(1)

    return result || null
  }

  async listReports(): Promise<UserReport[]> {
    return await db.select().from(userReports)
  }
}
