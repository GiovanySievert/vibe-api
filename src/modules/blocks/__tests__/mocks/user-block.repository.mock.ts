import { UserBlock } from '../../domain/mappers'
import { UserBlockRepository } from '../../domain/repositories'

export class MockUserBlockRepository implements UserBlockRepository {
  private blocks: UserBlock[] = []

  async create(blockerId: string, blockedId: string): Promise<UserBlock> {
    const newBlock: UserBlock = {
      id: crypto.randomUUID(),
      blockerId,
      blockedId,
      createdAt: new Date()
    }
    this.blocks.push(newBlock)
    return newBlock
  }

  async delete(blockerId: string, blockedId: string): Promise<void> {
    this.blocks = this.blocks.filter((b) => !(b.blockerId === blockerId && b.blockedId === blockedId))
  }

  async findBlock(blockerId: string, blockedId: string): Promise<UserBlock | null> {
    return this.blocks.find((b) => b.blockerId === blockerId && b.blockedId === blockedId) || null
  }

  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const block = await this.findBlock(blockerId, blockedId)
    return !!block
  }

  async listBlockedUsers(blockerId: string): Promise<UserBlock[]> {
    return this.blocks.filter((b) => b.blockerId === blockerId)
  }

  reset() {
    this.blocks = []
  }

  seed(data: UserBlock[]) {
    this.blocks = [...data]
  }

  getAll() {
    return [...this.blocks]
  }
}
