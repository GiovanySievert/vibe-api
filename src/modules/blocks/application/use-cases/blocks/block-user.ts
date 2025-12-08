import { UserBlockRepository } from '../../../domain/repositories'
import { CannotBlockYourselfException, UserAlreadyBlockedException } from '../../../domain/exceptions'
import { UserBlock } from '../../../domain/mappers'

export class BlockUser {
  constructor(private readonly userBlockRepository: UserBlockRepository) {}

  async execute(blockerId: string, blockedId: string): Promise<UserBlock> {
    if (blockerId === blockedId) {
      throw new CannotBlockYourselfException()
    }

    const existingBlock = await this.userBlockRepository.findBlock(blockerId, blockedId)
    if (existingBlock) {
      throw new UserAlreadyBlockedException()
    }

    return await this.userBlockRepository.create(blockerId, blockedId)
  }
}
