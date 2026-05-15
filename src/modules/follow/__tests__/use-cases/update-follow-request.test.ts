import { describe, it, expect, beforeEach } from 'bun:test'
import { UpdateFollowRequest } from '../../application/use-cases/follow-request/update-follow-request'
import { MockFollowRequestRepository } from '../mocks/follow-request.repository.mock'

describe('UpdateFollowRequest', () => {
  let followRequestRepo: MockFollowRequestRepository
  let useCase: UpdateFollowRequest

  beforeEach(() => {
    followRequestRepo = new MockFollowRequestRepository()
    useCase = new UpdateFollowRequest(followRequestRepo)
  })

  it('should update a follow request status to accepted', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute(followRequest.id!, { status: 'accepted' })

    expect(result).toBeDefined()
    expect(result.id).toBe(followRequest.id!)
    expect(result.status).toBe('accepted')
    expect(result.requesterId).toBe('user-1')
    expect(result.requestedId).toBe('user-2')
  })

  it('should update a follow request status to rejected', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-2',
      requesterId: 'user-3',
      requestedId: 'user-4',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute(followRequest.id!, { status: 'rejected' })

    expect(result.status).toBe('rejected')
    expect(result.id).toBe(followRequest.id!)
  })

  it('should persist the updated status in the repository', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-3',
      requesterId: 'user-5',
      requestedId: 'user-6',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await useCase.execute(followRequest.id!, { status: 'cancelled' })

    const stored = await followRequestRepo.getById(followRequest.id!)
    expect(stored).not.toBeNull()
    expect(stored!.status).toBe('cancelled')
  })

  it('should throw when updating a non-existent follow request', async () => {
    expect(async () => {
      await useCase.execute('non-existent-id', { status: 'accepted' })
    }).toThrow()
  })
})
