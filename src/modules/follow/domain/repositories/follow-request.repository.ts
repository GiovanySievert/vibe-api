import { FollowRequests } from '../mappers'

export interface FollowRequestsRepository {
  create(data: FollowRequests): Promise<FollowRequests>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
