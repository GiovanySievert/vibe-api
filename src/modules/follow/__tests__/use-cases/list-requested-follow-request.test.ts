import { describe, it, expect, beforeEach } from 'bun:test'
import { ListRequestedFollowRequest } from '../../application/use-cases/follow-request/list-requested-follow-request'
import { MockFollowRequestRepository } from '../mocks/follow-request.repository.mock'

describe('ListRequestedFollowRequest', () => {
  let repository: MockFollowRequestRepository
  let useCase: ListRequestedFollowRequest

  beforeEach(() => {
    repository = new MockFollowRequestRepository()
    useCase = new ListRequestedFollowRequest(repository)
  })

  it('should list all requests sent by the user', async () => {
    await repository.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await repository.create({
      id: 'request-2',
      requesterId: 'user-1',
      requestedId: 'user-3',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(2)
  })

  it('should return empty array when user has not sent any requests', async () => {
    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should only list requests where user is the requester (sent)', async () => {
    await repository.create({
      id: 'request-1',
      requesterId: 'user-2',
      requestedId: 'user-1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should return requested user id in the userId field', async () => {
    await repository.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-2')
  })

  it('should only include pending status requests', async () => {
    await repository.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await repository.create({
      id: 'request-2',
      requesterId: 'user-1',
      requestedId: 'user-3',
      status: 'accepted',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await repository.create({
      id: 'request-3',
      requesterId: 'user-1',
      requestedId: 'user-4',
      status: 'cancelled',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('pending')
    expect(result[0].userId).toBe('user-2')
  })

  it('should respect pagination limit', async () => {
    for (let i = 0; i < 5; i++) {
      await repository.create({
        id: `request-${i}`,
        requesterId: 'user-1',
        requestedId: `target-${i}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const result = await useCase.execute('user-1', 1, 2)

    expect(result).toHaveLength(2)
  })

  it('should return correct page when paginating', async () => {
    for (let i = 0; i < 5; i++) {
      await repository.create({
        id: `request-${i}`,
        requesterId: 'user-1',
        requestedId: `target-${i}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    const page1 = await useCase.execute('user-1', 1, 2)
    const page2 = await useCase.execute('user-1', 2, 2)
    const page3 = await useCase.execute('user-1', 3, 2)

    expect(page1).toHaveLength(2)
    expect(page2).toHaveLength(2)
    expect(page3).toHaveLength(1)
    const ids = new Set([page1[0].id, page1[1].id, page2[0].id, page2[1].id, page3[0].id])
    expect(ids.size).toBe(5)
  })

  it('should return empty array when page is beyond available data', async () => {
    await repository.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1', 5, 10)

    expect(result).toHaveLength(0)
  })

  it('should propagate repository error', async () => {
    const failingRepo = {
      listByType: async () => {
        throw new Error('db failure')
      }
    } as unknown as ConstructorParameters<typeof ListRequestedFollowRequest>[0]

    const failingUseCase = new ListRequestedFollowRequest(failingRepo)

    await expect(failingUseCase.execute('user-1')).rejects.toThrow('db failure')
  })
})
