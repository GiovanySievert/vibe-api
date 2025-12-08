import { PublicUserRepository } from '../../domain/repositories'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

interface BlockRelation {
  blockerId: string
  blockedId: string
}

export class MockPublicUserRepository implements PublicUserRepository {
  private users: Users[] = []
  private blocks: BlockRelation[] = []

  async getUserById(userId: string, loggedUserId: string): Promise<Users | null> {
    const user = this.users.find((u) => u.id === userId)

    if (!user) return null

    const isBlocked = this.blocks.some((b) => b.blockerId === userId && b.blockedId === loggedUserId)

    if (isBlocked) return null

    return user
  }

  async getUserByUsername(username: string, userIdToExclude: string): Promise<Users[]> {
    return this.users.filter((u) => {
      if (!u.username.includes(username)) return false
      if (u.id === userIdToExclude) return false

      const isBlocked = this.blocks.some((b) => b.blockerId === u.id && b.blockedId === userIdToExclude)

      return !isBlocked
    })
  }

  addBlock(blockerId: string, blockedId: string) {
    this.blocks.push({ blockerId, blockedId })
  }

  reset() {
    this.users = []
    this.blocks = []
  }

  seed(users: Users[]) {
    this.users = [...users]
  }

  getAll() {
    return [...this.users]
  }
}
