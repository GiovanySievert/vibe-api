import { FollowRequests } from '../../domain/mappers'
import { FollowRequestsRepository } from '../../domain/repositories'
import { GetFollowRequestByUserDtoMapper } from '../../infrastructure/http/dtos'
import { FollowRequestStatus, FollowRequestListType } from '../../domain/types'

export class MockFollowRequestRepository implements FollowRequestsRepository {
  private followRequests: FollowRequests[] = []

  async create(data: FollowRequests): Promise<FollowRequests> {
    const newFollowRequest: FollowRequests = {
      id: data.id || crypto.randomUUID(),
      requesterId: data.requesterId,
      requestedId: data.requestedId,
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.followRequests.push(newFollowRequest)
    return newFollowRequest
  }

  async getById(requestFollowId: string): Promise<FollowRequests | null> {
    return this.followRequests.find((fr) => fr.id === requestFollowId) || null
  }

  async getPendingRequest(requesterId: string, requestedId: string): Promise<FollowRequests | null> {
    return (
      this.followRequests.find(
        (fr) => fr.requesterId === requesterId && fr.requestedId === requestedId && fr.status === FollowRequestStatus.PENDING
      ) || null
    )
  }

  async getByRequesterAndRequested(requesterId: string, requestedId: string): Promise<FollowRequests | null> {
    return this.followRequests.find((fr) => fr.requesterId === requesterId && fr.requestedId === requestedId) || null
  }

  async update(requestFollowId: string, status: string): Promise<FollowRequests> {
    const index = this.followRequests.findIndex((fr) => fr.id === requestFollowId)
    if (index === -1) {
      throw new Error('Follow request not found')
    }
    this.followRequests[index].status = status
    this.followRequests[index].updatedAt = new Date()
    return this.followRequests[index]
  }

  async listByType(type: FollowRequestListType, userId: string): Promise<GetFollowRequestByUserDtoMapper[]> {
    const isReceived = type === FollowRequestListType.RECEIVED
    const filterField = isReceived ? 'requestedId' : 'requesterId'
    const userIdField = isReceived ? 'requesterId' : 'requestedId'

    return this.followRequests
      .filter((fr) => fr[filterField] === userId && fr.status === FollowRequestStatus.PENDING)
      .map((fr) => ({
        id: fr.id,
        userId: fr[userIdField],
        username: `user-${fr[userIdField]}`,
        avatar: null,
        status: fr.status,
        createdAt: (fr.createdAt || new Date()).toISOString()
      }))
  }

  reset() {
    this.followRequests = []
  }

  seed(data: FollowRequests[]) {
    this.followRequests = [...data]
  }

  getAll() {
    return [...this.followRequests]
  }
}
