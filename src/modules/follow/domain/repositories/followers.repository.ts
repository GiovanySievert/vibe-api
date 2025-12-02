import { ListUserFollowResponseDto } from '../../infrastructure/http/dtos'
import { Followers } from '../mappers'

export interface FollowersRepository {
  create(data: Omit<Followers, 'id' | 'createdAt'>): Promise<Followers>
  getByFollowerAndFollowing(followerId: string, followingId: string): Promise<Followers | null>
  listFollowers(userId: string, page?: number): Promise<ListUserFollowResponseDto[]>
  listFollowings(userId: string, page?: number): Promise<ListUserFollowResponseDto[]>
  delete(followId: string): Promise<void>
  isFollowing(followerId: string, followingId: string): Promise<boolean>
}
