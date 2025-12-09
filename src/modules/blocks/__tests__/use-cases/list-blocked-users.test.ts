import { describe, it, expect, beforeEach } from 'bun:test'
import { ListBlockedUsers } from '../../application/use-cases'
import { MockUserBlockRepository } from '../mocks/user-block.repository.mock'

describe('ListBlockedUsers', () => {
  let listBlockedUsers: ListBlockedUsers
  let mockUserBlockRepo: MockUserBlockRepository

  beforeEach(() => {
    mockUserBlockRepo = new MockUserBlockRepository()
    listBlockedUsers = new ListBlockedUsers(mockUserBlockRepo)
  })

  it('should list all blocked users', async () => {
    const blockerId = 'user-1'
    const blockedId1 = 'user-2'
    const blockedId2 = 'user-3'

    await mockUserBlockRepo.create(blockerId, blockedId1)
    await mockUserBlockRepo.create(blockerId, blockedId2)

    const result = await listBlockedUsers.execute(blockerId)

    expect(result).toHaveLength(2)
    expect(result[0].userId).toBe(blockedId1)
    expect(result[0].username).toBe(`user-${blockedId1}`)
    expect(result[1].userId).toBe(blockedId2)
    expect(result[1].username).toBe(`user-${blockedId2}`)
  })

  it('should return empty array when no users are blocked', async () => {
    const blockerId = 'user-1'

    const result = await listBlockedUsers.execute(blockerId)

    expect(result).toHaveLength(0)
  })

  it('should only return blocks for the specific blocker', async () => {
    const blockerId1 = 'user-1'
    const blockerId2 = 'user-2'
    const blockedId = 'user-3'

    await mockUserBlockRepo.create(blockerId1, blockedId)
    await mockUserBlockRepo.create(blockerId2, blockedId)

    const result = await listBlockedUsers.execute(blockerId1)

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe(blockedId)
  })
})
