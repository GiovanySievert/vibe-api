import { BlockedUserQueryResult } from './blocked-user-query-result.dto'

export interface GetBlockedUserDto {
  id: string
  userId: string
  username: string
  avatar: string | null
  blockedAt: string
}

export class GetBlockedUserDtoMapper {
  static from(data: BlockedUserQueryResult): GetBlockedUserDto {
    return {
      id: data.userBlocks.id,
      userId: data.users.id,
      username: data.users.username,
      avatar: data.users.avatar || null,
      blockedAt: data.userBlocks.createdAt.toISOString()
    }
  }

  static fromArray(data: BlockedUserQueryResult[]): GetBlockedUserDto[] {
    return data.map((item) => this.from(item))
  }
}
