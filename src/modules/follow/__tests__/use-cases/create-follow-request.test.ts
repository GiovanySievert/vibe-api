import { describe, it, expect, beforeEach } from 'bun:test'
import { CreateFollowRequest } from '../../application/use-cases/follow-request/create-follower-request'
import { MockFollowRequestRepository } from '../mocks/follow-request.repository.mock'
import { MockFollowersRepository } from '../mocks/followers.repository.mock'
import { CannotFollowYourselfException } from '../../domain/exceptions/cannot-follow-yourself.exception'
import { AlreadyFollowingException } from '../../domain/exceptions/already-following.exception'
import { FollowRequestAlreadyExistsException } from '../../domain/exceptions/follow-request-already-exists.exception'

describe('CreateFollowRequest', () => {
  let followRequestRepo: MockFollowRequestRepository
  let followersRepo: MockFollowersRepository
  let useCase: CreateFollowRequest

  beforeEach(() => {
    followRequestRepo = new MockFollowRequestRepository()
    followersRepo = new MockFollowersRepository(followRequestRepo)
    useCase = new CreateFollowRequest(followRequestRepo, followersRepo)
  })

  it('should create a follow request successfully', async () => {
    const data = {
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending'
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(result.requesterId).toBe(data.requesterId)
    expect(result.requestedId).toBe(data.requestedId)
    expect(result.status).toBe('pending')
  })

  it('should throw CannotFollowYourselfException when trying to follow yourself', async () => {
    const data = {
      requesterId: 'user-1',
      requestedId: 'user-1',
      status: 'pending'
    }

    expect(async () => {
      await useCase.execute(data)
    }).toThrow(CannotFollowYourselfException)
  })

  it('should throw AlreadyFollowingException when already following the user', async () => {
    await followersRepo.create({
      followerId: 'user-1',
      followingId: 'user-2'
    })

    const data = {
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending'
    }

    expect(async () => {
      await useCase.execute(data)
    }).toThrow(AlreadyFollowingException)
  })

  it('should throw FollowRequestAlreadyExistsException when a pending request already exists', async () => {
    await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const data = {
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending'
    }

    expect(async () => {
      await useCase.execute(data)
    }).toThrow(FollowRequestAlreadyExistsException)
  })

  it('should allow creating a new request if previous was rejected', async () => {
    await followRequestRepo.create({
      id: 'request-1',
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'rejected',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const data = {
      requesterId: 'user-1',
      requestedId: 'user-2',
      status: 'pending'
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(result.status).toBe('pending')
  })
})
