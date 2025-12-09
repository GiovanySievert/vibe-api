import { BlockedUserQueryResult } from './blocked-user-query-result.dto'

export interface GetBlockedUserDto {
  id: string
  userId: string
  username: string
  avatar: string | null
}

export class GetBlockedUserDtoMapper {
  static from(data: BlockedUserQueryResult): GetBlockedUserDto {
    return {
      id: data.userBlocks.id,
      userId: data.users.id,
      username: data.users.username,
      avatar: data.users.avatar || null
    }
  }

  static fromArray(data: BlockedUserQueryResult[]): GetBlockedUserDto[] {
    return data.map((item) => this.from(item))
  }
}
