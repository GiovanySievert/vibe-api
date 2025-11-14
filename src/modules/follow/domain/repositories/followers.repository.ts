import { ListUserFollowResponseDto } from '../../http/dtos'
import { Followers } from '../mappers'

export interface FollowersRepository {
  create(data: Followers): Promise<Followers>
  listFollowers(userId: string): Promise<ListUserFollowResponseDto[]>
  listFollowings(userId: string): Promise<ListUserFollowResponseDto[]>
  delete(followId: string): Promise<void>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
