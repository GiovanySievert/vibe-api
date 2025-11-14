import { FollowStats } from '../mappers'

export interface FollowStatsRepository {
  listFollowStats(userId: string): Promise<FollowStats[]>

  incrementFollowersStats(userId: string): Promise<FollowStats>
  decrementFollowersStats(followId: string): Promise<void>

  incrementFollowingStats(userId: string): Promise<FollowStats>
  decrementFollowingStats(userId: string): Promise<void>

  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
