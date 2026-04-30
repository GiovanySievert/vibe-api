import { UserReportRepository } from '../../../domain/repositories'
import { CannotReportYourselfException, UserAlreadyReportedException } from '../../../domain/exceptions'
import { UserReport } from '../../../domain/mappers'

export class ReportUser {
  constructor(private readonly userReportRepository: UserReportRepository) {}

  async execute(reporterId: string, reportedId: string, reason: string, description: string | null): Promise<UserReport> {
    if (reporterId === reportedId) {
      throw new CannotReportYourselfException()
    }

    const existingReport = await this.userReportRepository.findReport(reporterId, reportedId)
    if (existingReport) {
      throw new UserAlreadyReportedException()
    }

    return await this.userReportRepository.create(reporterId, reportedId, reason, description)
  }
}
