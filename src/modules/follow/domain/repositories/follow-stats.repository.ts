import { FollowStats } from '../mappers'

export interface FollowStatsRepository {
  createFollow(userId: string): Promise<FollowStats>
  deleteFollow(userId: string): Promise<void>

  createFollowing(userId: string): Promise<FollowStats>
  deleteFollowing(userId: string): Promise<void>

  list(userId: string): Promise<FollowStats[]>

  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
