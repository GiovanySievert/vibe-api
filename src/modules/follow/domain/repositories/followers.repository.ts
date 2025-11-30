import { ListUserFollowResponseDto } from '../../infrastructure/http/dtos'
import { Followers } from '../mappers'

export interface FollowersRepository {
  create(data: Followers): Promise<Followers>
  listFollowers(userId: string): Promise<ListUserFollowResponseDto[]>
  listFollowings(userId: string): Promise<ListUserFollowResponseDto[]>
  delete(followId: string): Promise<void>
  isFollowing(followerId: string, followingId: string): Promise<boolean>
}
