import { FollowRequests } from '../mappers'

export interface FollowRequestsRepository {
  create(data: FollowRequests): Promise<FollowRequests>
  update(requestFollowId: string, status: string): Promise<FollowRequests>
  listByUser(userId: string): Promise<FollowRequests[]>
  // delete(data: any): Promise<void>
}
