import { FollowStats } from '../mappers'

export interface FollowStatsRepository {
  create(data: FollowStats): Promise<FollowStats>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
