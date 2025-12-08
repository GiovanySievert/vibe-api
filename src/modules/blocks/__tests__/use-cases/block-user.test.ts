import { describe, it, expect, beforeEach } from 'bun:test'
import { BlockUser } from '../../application/use-cases'
import { MockUserBlockRepository } from '../mocks/user-block.repository.mock'
import { CannotBlockYourselfException, UserAlreadyBlockedException } from '../../domain/exceptions'

describe('BlockUser', () => {
  let blockUser: BlockUser
  let mockUserBlockRepo: MockUserBlockRepository

  beforeEach(() => {
    mockUserBlockRepo = new MockUserBlockRepository()
    blockUser = new BlockUser(mockUserBlockRepo)
  })

  it('should block a user successfully', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    const result = await blockUser.execute(blockerId, blockedId)

    expect(result).toBeDefined()
    expect(result.blockerId).toBe(blockerId)
    expect(result.blockedId).toBe(blockedId)

    const isBlocked = await mockUserBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlocked).toBe(true)
  })

  it('should throw CannotBlockYourselfException when trying to block yourself', async () => {
    const userId = 'user-1'

    expect(async () => {
      await blockUser.execute(userId, userId)
    }).toThrow(CannotBlockYourselfException)
  })

  it('should throw UserAlreadyBlockedException when user is already blocked', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    await mockUserBlockRepo.create(blockerId, blockedId)

    expect(async () => {
      await blockUser.execute(blockerId, blockedId)
    }).toThrow(UserAlreadyBlockedException)
  })
})
