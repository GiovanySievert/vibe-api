import { UserBlockRepository } from '../../../domain/repositories'

export class CheckBlockStatus {
  constructor(private readonly userBlockRepository: UserBlockRepository) {}

  async execute(blockerId: string, blockedId: string): Promise<boolean> {
    return await this.userBlockRepository.isBlocked(blockerId, blockedId)
  }
}
