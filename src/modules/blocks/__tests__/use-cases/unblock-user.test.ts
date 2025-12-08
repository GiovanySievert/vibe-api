import { describe, it, expect, beforeEach } from 'bun:test'
import { UnblockUser } from '../../application/use-cases'
import { MockUserBlockRepository } from '../mocks/user-block.repository.mock'
import { UserNotBlockedException } from '../../domain/exceptions'

describe('UnblockUser', () => {
  let unblockUser: UnblockUser
  let mockUserBlockRepo: MockUserBlockRepository

  beforeEach(() => {
    mockUserBlockRepo = new MockUserBlockRepository()
    unblockUser = new UnblockUser(mockUserBlockRepo)
  })

  it('should unblock a user successfully', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    await mockUserBlockRepo.create(blockerId, blockedId)
    const isBlockedBefore = await mockUserBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlockedBefore).toBe(true)

    await unblockUser.execute(blockerId, blockedId)

    const isBlockedAfter = await mockUserBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlockedAfter).toBe(false)
  })

  it('should throw UserNotBlockedException when user is not blocked', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    expect(async () => {
      await unblockUser.execute(blockerId, blockedId)
    }).toThrow(UserNotBlockedException)
  })
})
