import { User } from 'better-auth/types'
import { ReportUser, ListReports } from '../../../application/use-cases'
import { CreateReportDto } from '../dtos'

export class UserReportController {
  constructor(
    private readonly reportUser: ReportUser,
    private readonly listReports: ListReports
  ) {}

  async report({ params, body, user }: { params: { userId: string }; body: CreateReportDto; user: User }) {
    return await this.reportUser.execute(user.id, params.userId, body.reason, body.description ?? null)
  }

  async list({ user }: { user: User }) {
    return await this.listReports.execute()
  }
}
