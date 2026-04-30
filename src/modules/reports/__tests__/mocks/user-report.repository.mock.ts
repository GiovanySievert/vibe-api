import { UserReport } from '../../domain/mappers'
import { UserReportRepository } from '../../domain/repositories'

export class MockUserReportRepository implements UserReportRepository {
  private reports: UserReport[] = []

  async create(reporterId: string, reportedId: string, reason: string, description: string | null): Promise<UserReport> {
    const newReport: UserReport = {
      id: crypto.randomUUID(),
      reporterId,
      reportedId,
      reason,
      description,
      createdAt: new Date()
    }
    this.reports.push(newReport)
    return newReport
  }

  async findReport(reporterId: string, reportedId: string): Promise<UserReport | null> {
    return this.reports.find((r) => r.reporterId === reporterId && r.reportedId === reportedId) || null
  }

  async listReports(): Promise<UserReport[]> {
    return [...this.reports]
  }

  reset() {
    this.reports = []
  }

  seed(data: UserReport[]) {
    this.reports = [...data]
  }

  getAll() {
    return [...this.reports]
  }
}
