import { GetFollowRequestByUserDtoMapper } from '../../infrastructure/http/dtos'
import { FollowRequests } from '../mappers'
import { FollowRequestListType } from '../types'

export interface FollowRequestsRepository {
  create(data: FollowRequests): Promise<FollowRequests>
  getById(requestFollowId: string): Promise<FollowRequests | null>
  getPendingRequest(requesterId: string, requestedId: string): Promise<FollowRequests | null>
  getByRequesterAndRequested(requesterId: string, requestedId: string): Promise<FollowRequests | null>
  update(requestFollowId: string, status: string): Promise<FollowRequests>
  listByType(type: FollowRequestListType, userId: string): Promise<GetFollowRequestByUserDtoMapper[]>
}
