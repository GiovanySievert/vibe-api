import { UserBlockRepository } from '../../../domain/repositories'
import { UserBlock } from '../../../domain/mappers'

export class ListBlockedUsers {
  constructor(private readonly userBlockRepository: UserBlockRepository) {}

  async execute(blockerId: string): Promise<UserBlock[]> {
    return await this.userBlockRepository.listBlockedUsers(blockerId)
  }
}
