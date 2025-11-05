import { Followers } from '../mappers'

export interface FollowersRepository {
  create(data: Followers): Promise<Followers>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
