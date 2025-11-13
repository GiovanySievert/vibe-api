import { Followers } from '../mappers'

export interface FollowersRepository {
  create(data: Followers): Promise<Followers>
  delete(data: Followers): Promise<void>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
