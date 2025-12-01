import { describe, it, expect, beforeEach } from 'bun:test'
import { ListFollowRequest } from '../../application/use-cases/follow-request/list-follow-request'
import { MockFollowRequestRepository } from '../mocks/follow-request.repository.mock'

describe('ListFollowRequest', () => {
  let repository: MockFollowRequestRepository
  let useCase: ListFollowRequest

  beforeEach(() => {
    repository = new MockFollowRequestRepository()
    useCase = new ListFollowRequest(repository)
  })

  it('should list all follow requests for a user', async () => {
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
      requesterId: 'user-3',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-2')

    expect(result).toHaveLength(2)
  })

  it('should return empty array when user has no requests', async () => {
    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(0)
  })

  it('should list requests where user is requester', async () => {
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
    expect(result[0].requesterId).toBe('user-1')
  })

  it('should list requests where user is requested', async () => {
    await repository.create({
      id: 'request-1',
      requesterId: 'user-2',
      requestedId: 'user-1',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(1)
    expect(result[0].requestedId).toBe('user-1')
  })

  it('should include all request statuses', async () => {
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
      status: 'rejected',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute('user-1')

    expect(result).toHaveLength(3)
  })
})
