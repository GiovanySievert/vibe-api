import { describe, it, expect, beforeEach } from 'bun:test'
import { CheckBlockStatus } from '../../application/use-cases'
import { MockUserBlockRepository } from '../mocks/user-block.repository.mock'

describe('CheckBlockStatus', () => {
  let checkBlockStatus: CheckBlockStatus
  let mockUserBlockRepo: MockUserBlockRepository

  beforeEach(() => {
    mockUserBlockRepo = new MockUserBlockRepository()
    checkBlockStatus = new CheckBlockStatus(mockUserBlockRepo)
  })

  it('should return true when user is blocked', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    await mockUserBlockRepo.create(blockerId, blockedId)

    const result = await checkBlockStatus.execute(blockerId, blockedId)
    expect(result).toBe(true)
  })

  it('should return false when user is not blocked', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    const result = await checkBlockStatus.execute(blockerId, blockedId)
    expect(result).toBe(false)
  })
})
