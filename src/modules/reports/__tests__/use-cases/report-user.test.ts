import { describe, it, expect, beforeEach } from 'bun:test'
import { ReportUser } from '../../application/use-cases'
import { MockUserReportRepository } from '../mocks/user-report.repository.mock'
import { CannotReportYourselfException, UserAlreadyReportedException } from '../../domain/exceptions'

describe('ReportUser', () => {
  let reportUser: ReportUser
  let mockUserReportRepo: MockUserReportRepository

  beforeEach(() => {
    mockUserReportRepo = new MockUserReportRepository()
    reportUser = new ReportUser(mockUserReportRepo)
  })

  it('should report a user successfully', async () => {
    const reporterId = 'user-1'
    const reportedId = 'user-2'

    const result = await reportUser.execute(reporterId, reportedId, 'spam', null)

    expect(result).toBeDefined()
    expect(result.reporterId).toBe(reporterId)
    expect(result.reportedId).toBe(reportedId)
    expect(result.reason).toBe('spam')
    expect(result.description).toBeNull()

    const reports = mockUserReportRepo.getAll()
    expect(reports).toHaveLength(1)
  })

  it('should throw CannotReportYourselfException when trying to report yourself', async () => {
    const userId = 'user-1'

    expect(async () => {
      await reportUser.execute(userId, userId, 'spam', null)
    }).toThrow(CannotReportYourselfException)
  })

  it('should throw UserAlreadyReportedException when user is already reported', async () => {
    const reporterId = 'user-1'
    const reportedId = 'user-2'

    await mockUserReportRepo.create(reporterId, reportedId, 'spam', null)

    expect(async () => {
      await reportUser.execute(reporterId, reportedId, 'harassment', null)
    }).toThrow(UserAlreadyReportedException)
  })
})
