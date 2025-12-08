import { UserBlockRepository } from '../../../domain/repositories'
import { UserNotBlockedException } from '../../../domain/exceptions'

export class UnblockUser {
  constructor(private readonly userBlockRepository: UserBlockRepository) {}

  async execute(blockerId: string, blockedId: string): Promise<void> {
    const existingBlock = await this.userBlockRepository.findBlock(blockerId, blockedId)
    if (!existingBlock) {
      throw new UserNotBlockedException()
    }

    await this.userBlockRepository.delete(blockerId, blockedId)
  }
}
