import { ListUserFollowResponseDto, FollowStatusResponseDto } from '../../infrastructure/http/dtos'
import { Followers } from '../mappers'

export interface FollowersRepository {
  create(data: Omit<Followers, 'id' | 'createdAt'>): Promise<Followers>
  getById(followId: string): Promise<Followers | null>
  getByFollowerAndFollowing(followerId: string, followingId: string): Promise<Followers | null>
  listFollowers(userId: string, page?: number): Promise<ListUserFollowResponseDto[]>
  listFollowings(userId: string, page?: number): Promise<ListUserFollowResponseDto[]>
  delete(followId: string): Promise<void>
  getFollowStatus(followerId: string, followingId: string): Promise<FollowStatusResponseDto>
}
