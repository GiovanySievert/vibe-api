import { FollowStatus } from '../../../domain/types'

export interface FollowStatusResponseDto {
  status: FollowStatus
  id?: string
}

export class FollowStatusResponseDtoMapper {
  static create(status: FollowStatus, id?: string): FollowStatusResponseDto {
    return {
      status,
      id
    }
  }
}
