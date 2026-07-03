import { UserBlock } from '../mappers'
import { GetBlockedUserDto } from '../../infrastructure/http/dtos'

export interface UserBlockRepository {
  create(blockerId: string, blockedId: string): Promise<UserBlock>
  delete(blockerId: string, blockedId: string): Promise<void>
  findBlock(blockerId: string, blockedId: string): Promise<UserBlock | null>
  isBlocked(blockerId: string, blockedId: string): Promise<boolean>
  isBlockedEitherWay(userAId: string, userBId: string): Promise<boolean>
  listBlockedUsers(blockerId: string, page?: number, limit?: number): Promise<GetBlockedUserDto[]>
}
