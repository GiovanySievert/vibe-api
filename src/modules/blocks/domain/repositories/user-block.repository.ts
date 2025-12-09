import { UserBlock } from '../mappers'
import { GetBlockedUserDto } from '../../infrastructure/http/dtos'

export interface UserBlockRepository {
  create(blockerId: string, blockedId: string): Promise<UserBlock>
  delete(blockerId: string, blockedId: string): Promise<void>
  findBlock(blockerId: string, blockedId: string): Promise<UserBlock | null>
  isBlocked(blockerId: string, blockedId: string): Promise<boolean>
  listBlockedUsers(blockerId: string): Promise<GetBlockedUserDto[]>
}
