import { UserReportRepository } from '../../../domain/repositories'
import { UserReport } from '../../../domain/mappers'

export class ListReports {
  constructor(private readonly userReportRepository: UserReportRepository) {}

  async execute(): Promise<UserReport[]> {
    return await this.userReportRepository.listReports()
  }
}
