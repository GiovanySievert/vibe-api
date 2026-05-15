import { describe, it, expect, beforeEach } from 'bun:test'
import { RejectFollowRequest } from '../../application/use-cases/follow-request/reject-follow-request'
import { UpdateFollowRequest } from '../../application/use-cases/follow-request/update-follow-request'
import { MockFollowRequestRepository } from '../mocks/follow-request.repository.mock'
import { FollowRequestNotFoundException } from '../../domain/exceptions/follow-request-not-found.exception'
import { FollowRequestAlreadyProcessedException } from '../../domain/exceptions/follow-request-already-processed.exception'
import { UnauthorizedFollowRequestActionException } from '../../domain/exceptions/unauthorized-follow-request-action.exception'

describe('RejectFollowRequest', () => {
  let followRequestRepo: MockFollowRequestRepository
  let updateFollowRequestService: UpdateFollowRequest
  let useCase: RejectFollowRequest

  beforeEach(() => {
    followRequestRepo = new MockFollowRequestRepository()
    updateFollowRequestService = new UpdateFollowRequest(followRequestRepo)
    useCase = new RejectFollowRequest(followRequestRepo, updateFollowRequestService)
  })

  it('should reject a follow request successfully', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await useCase.execute(followRequest.id, 'user-2')

    expect(result.status).toBe('rejected')
  })

  it('should throw FollowRequestNotFoundException when request does not exist', async () => {
    expect(async () => {
      await useCase.execute('non-existent-id', 'user-2')
    }).toThrow(FollowRequestNotFoundException)
  })

  it('should throw FollowRequestAlreadyProcessedException when request is not pending', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'accepted',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    expect(async () => {
      await useCase.execute(followRequest.id, 'user-2')
    }).toThrow(FollowRequestAlreadyProcessedException)
  })

  it('should throw UnauthorizedFollowRequestActionException when user is not requested user', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    expect(async () => {
      await useCase.execute(followRequest.id, 'user-3')
    }).toThrow(UnauthorizedFollowRequestActionException)
  })

  it('should not allow rejecting cancelled requests', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'cancelled',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    expect(async () => {
      await useCase.execute(followRequest.id, 'user-2')
    }).toThrow(FollowRequestAlreadyProcessedException)
  })

  it('should not allow rejecting rejected requests', async () => {
    const followRequest = await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'rejected',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    expect(async () => {
      await useCase.execute(followRequest.id, 'user-2')
    }).toThrow(FollowRequestAlreadyProcessedException)
  })
})
