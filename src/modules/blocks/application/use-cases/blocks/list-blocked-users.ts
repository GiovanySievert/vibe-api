import { UserBlockRepository } from '../../../domain/repositories'
import { GetBlockedUserDto } from '../../../infrastructure/http/dtos'

export class ListBlockedUsers {
  constructor(private readonly userBlockRepository: UserBlockRepository) {}

  async execute(blockerId: string): Promise<GetBlockedUserDto[]> {
    return await this.userBlockRepository.listBlockedUsers(blockerId)
  }
}
