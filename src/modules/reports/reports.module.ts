import { ReportUser, ListReports } from './application/use-cases'
import { DrizzleUserReportRepository } from './infrastructure/persistence'
import { UserReportController } from './infrastructure/http/controllers'

export class ReportsModule {
  public readonly userReportController: UserReportController

  constructor() {
    const userReportRepo = new DrizzleUserReportRepository()
    const reportUserService = new ReportUser(userReportRepo)
    const listReportsService = new ListReports(userReportRepo)

    this.userReportController = new UserReportController(reportUserService, listReportsService)
  }
}
