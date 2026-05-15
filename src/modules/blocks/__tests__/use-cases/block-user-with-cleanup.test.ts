import { describe, it, expect, beforeEach } from 'bun:test'
import { BlockUserWithCleanup } from '../../application/use-cases/blocks/block-user-with-cleanup'
import { MockUserBlockRepository } from '../mocks/user-block.repository.mock'
import { CannotBlockYourselfException, UserAlreadyBlockedException } from '../../domain/exceptions'
import { FollowRequestStatus } from '@src/modules/follow/domain/types'
import { FollowRequestsRepository } from '@src/modules/follow/domain/repositories'
import { FollowRequests } from '@src/modules/follow/domain/mappers'
import { Unfollow, RemoveFollower } from '@src/modules/follow/application/use-cases'

type ExecutionStep = {
  action: string
  args: unknown[]
}

class StubUnfollow {
  public calls: Array<[string, string]> = []
  public shouldThrow: Error | null = null
  public log: ExecutionStep[]

  constructor(log: ExecutionStep[]) {
    this.log = log
  }

  async execute(followerId: string, followingId: string): Promise<void> {
    this.calls.push([followerId, followingId])
    this.log.push({ action: 'unfollow', args: [followerId, followingId] })
    if (this.shouldThrow) throw this.shouldThrow
  }
}

class StubRemoveFollower {
  public calls: Array<[string, string]> = []
  public shouldThrow: Error | null = null
  public log: ExecutionStep[]

  constructor(log: ExecutionStep[]) {
    this.log = log
  }

  async execute(loggedUserId: string, followId: string): Promise<void> {
    this.calls.push([loggedUserId, followId])
    this.log.push({ action: 'removeFollower', args: [loggedUserId, followId] })
    if (this.shouldThrow) throw this.shouldThrow
  }

  async executeByUsers(loggedUserId: string, followerId: string): Promise<void> {
    this.calls.push([loggedUserId, followerId])
    this.log.push({ action: 'removeFollower', args: [loggedUserId, followerId] })
    if (this.shouldThrow) throw this.shouldThrow
  }
}

class StubFollowRequestRepository implements FollowRequestsRepository {
  public pending: Map<string, FollowRequests> = new Map()
  public updateCalls: Array<{ id: string; status: string }> = []
  public log: ExecutionStep[]
  public getPendingShouldThrow: Error | null = null
  public updateShouldThrow: Error | null = null

  constructor(log: ExecutionStep[]) {
    this.log = log
  }

  private key(requesterId: string, requestedId: string) {
    return `${requesterId}->${requestedId}`
  }

  seedPending(requesterId: string, requestedId: string, id: string) {
    this.pending.set(this.key(requesterId, requestedId), {
      id,
      requesterId,
      requestedId,
      status: FollowRequestStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    } as FollowRequests)
  }

  async getPendingRequest(requesterId: string, requestedId: string): Promise<FollowRequests | null> {
    this.log.push({ action: 'getPendingRequest', args: [requesterId, requestedId] })
    if (this.getPendingShouldThrow) throw this.getPendingShouldThrow
    return this.pending.get(this.key(requesterId, requestedId)) ?? null
  }

  async update(requestFollowId: string, status: string): Promise<FollowRequests> {
    this.log.push({ action: 'update', args: [requestFollowId, status] })
    if (this.updateShouldThrow) throw this.updateShouldThrow
    this.updateCalls.push({ id: requestFollowId, status })
    return {
      id: requestFollowId,
      requesterId: 'x',
      requestedId: 'y',
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    } as FollowRequests
  }

  async create(data: FollowRequests): Promise<FollowRequests> {
    return data
  }

  async getById(): Promise<FollowRequests | null> {
    return null
  }

  async getByRequesterAndRequested(): Promise<FollowRequests | null> {
    return null
  }

  async listByType() {
    return []
  }
}

describe('BlockUserWithCleanup', () => {
  let userBlockRepo: MockUserBlockRepository
  let log: ExecutionStep[]
  let unfollow: StubUnfollow
  let removeFollower: StubRemoveFollower
  let followRequestRepo: StubFollowRequestRepository
  let useCase: BlockUserWithCleanup

  beforeEach(() => {
    userBlockRepo = new MockUserBlockRepository()
    log = []
    unfollow = new StubUnfollow(log)
    removeFollower = new StubRemoveFollower(log)
    followRequestRepo = new StubFollowRequestRepository(log)
    useCase = new BlockUserWithCleanup(
      userBlockRepo,
      unfollow as unknown as Unfollow,
      removeFollower as unknown as RemoveFollower,
      followRequestRepo
    )
  })

  it('should block a user and run all cleanup steps in order', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    followRequestRepo.seedPending(blockerId, blockedId, 'req-out')
    followRequestRepo.seedPending(blockedId, blockerId, 'req-in')

    const result = await useCase.execute(blockerId, blockedId)

    expect(result).toBeDefined()
    expect(result.blockerId).toBe(blockerId)
    expect(result.blockedId).toBe(blockedId)

    expect(unfollow.calls).toEqual([[blockerId, blockedId]])
    expect(removeFollower.calls).toEqual([[blockerId, blockedId]])

    expect(followRequestRepo.updateCalls).toEqual([
      { id: 'req-out', status: FollowRequestStatus.CANCELLED },
      { id: 'req-in', status: FollowRequestStatus.CANCELLED }
    ])

    const actions = log.map((step) => step.action)
    expect(actions).toEqual([
      'unfollow',
      'removeFollower',
      'getPendingRequest',
      'update',
      'getPendingRequest',
      'update'
    ])

    const isBlocked = await userBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlocked).toBe(true)
  })

  it('should still complete the block when there are no pending follow requests', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    const result = await useCase.execute(blockerId, blockedId)

    expect(result.blockerId).toBe(blockerId)
    expect(result.blockedId).toBe(blockedId)
    expect(followRequestRepo.updateCalls).toEqual([])

    const actions = log.map((step) => step.action)
    expect(actions).toEqual(['unfollow', 'removeFollower', 'getPendingRequest', 'getPendingRequest'])

    const isBlocked = await userBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlocked).toBe(true)
  })

  it('should swallow errors thrown by unfollow and continue with the cleanup', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    unfollow.shouldThrow = new Error('no follow relationship')

    const result = await useCase.execute(blockerId, blockedId)

    expect(result.blockerId).toBe(blockerId)
    expect(removeFollower.calls).toEqual([[blockerId, blockedId]])

    const actions = log.map((step) => step.action)
    expect(actions).toEqual(['unfollow', 'removeFollower', 'getPendingRequest', 'getPendingRequest'])

    const isBlocked = await userBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlocked).toBe(true)
  })

  it('should swallow errors thrown by removeFollower and continue with the cleanup', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    removeFollower.shouldThrow = new Error('not a follower')
    followRequestRepo.seedPending(blockerId, blockedId, 'req-out')

    const result = await useCase.execute(blockerId, blockedId)

    expect(result.blockerId).toBe(blockerId)
    expect(followRequestRepo.updateCalls).toEqual([
      { id: 'req-out', status: FollowRequestStatus.CANCELLED }
    ])

    const isBlocked = await userBlockRepo.isBlocked(blockerId, blockedId)
    expect(isBlocked).toBe(true)
  })

  it('should cancel only the outgoing request when only that one is pending', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    followRequestRepo.seedPending(blockerId, blockedId, 'req-out')

    await useCase.execute(blockerId, blockedId)

    expect(followRequestRepo.updateCalls).toEqual([
      { id: 'req-out', status: FollowRequestStatus.CANCELLED }
    ])
  })

  it('should cancel only the incoming request when only that one is pending', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    followRequestRepo.seedPending(blockedId, blockerId, 'req-in')

    await useCase.execute(blockerId, blockedId)

    expect(followRequestRepo.updateCalls).toEqual([
      { id: 'req-in', status: FollowRequestStatus.CANCELLED }
    ])
  })

  it('should throw CannotBlockYourselfException when blocker equals blocked', async () => {
    expect(async () => {
      await useCase.execute('user-1', 'user-1')
    }).toThrow(CannotBlockYourselfException)

    expect(unfollow.calls).toHaveLength(0)
    expect(removeFollower.calls).toHaveLength(0)
    expect(followRequestRepo.updateCalls).toHaveLength(0)
  })

  it('should throw UserAlreadyBlockedException when the block already exists and not run any cleanup', async () => {
    const blockerId = 'user-1'
    const blockedId = 'user-2'

    await userBlockRepo.create(blockerId, blockedId)

    expect(async () => {
      await useCase.execute(blockerId, blockedId)
    }).toThrow(UserAlreadyBlockedException)

    expect(unfollow.calls).toHaveLength(0)
    expect(removeFollower.calls).toHaveLength(0)
    expect(followRequestRepo.updateCalls).toHaveLength(0)
  })

  it('should propagate errors from the follow request repository getPendingRequest call', async () => {
    followRequestRepo.getPendingShouldThrow = new Error('db unavailable')

    expect(async () => {
      await useCase.execute('user-1', 'user-2')
    }).toThrow('db unavailable')

    const isBlocked = await userBlockRepo.isBlocked('user-1', 'user-2')
    expect(isBlocked).toBe(false)
  })
})
