import { describe, it, expect, beforeEach } from 'bun:test'
import { ListReports } from '../../application/use-cases'
import { MockUserReportRepository } from '../mocks/user-report.repository.mock'

describe('ListReports', () => {
  let listReports: ListReports
  let mockUserReportRepo: MockUserReportRepository

  beforeEach(() => {
    mockUserReportRepo = new MockUserReportRepository()
    listReports = new ListReports(mockUserReportRepo)
  })

  it('should list all reports', async () => {
    await mockUserReportRepo.create('user-1', 'user-2', 'spam', null)
    await mockUserReportRepo.create('user-3', 'user-4', 'harassment', 'Comportamento agressivo')

    const result = await listReports.execute()

    expect(result).toHaveLength(2)
    expect(result[0].reporterId).toBe('user-1')
    expect(result[1].reason).toBe('harassment')
    expect(result[1].description).toBe('Comportamento agressivo')
  })

  it('should return empty array when no reports exist', async () => {
    const result = await listReports.execute()

    expect(result).toHaveLength(0)
  })
})
