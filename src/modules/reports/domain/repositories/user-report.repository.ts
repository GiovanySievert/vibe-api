import { UserReport } from '../mappers'

export interface UserReportRepository {
  create(reporterId: string, reportedId: string, reason: string, description: string | null): Promise<UserReport>
  findReport(reporterId: string, reportedId: string): Promise<UserReport | null>
  listReports(): Promise<UserReport[]>
}
