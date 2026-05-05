import { PublicUserRepository, UserSuggestion, TrendingUser } from '../../domain/repositories'
import { Users } from '@src/modules/auth/domain/mappers/user.mapper'

interface BlockRelation {
  blockerId: string
  blockedId: string
}

interface FollowRelation {
  followerId: string
  followingId: string
}

interface WeeklyActivity {
  userId: string
  isoYear: number
  isoWeek: number
  reviewCount: number
}

export class MockPublicUserRepository implements PublicUserRepository {
  private users: Users[] = []
  private blocks: BlockRelation[] = []
  private follows: FollowRelation[] = []
  private weeklyActivities: WeeklyActivity[] = []

  async getTrending(userId: string, limit = 20): Promise<TrendingUser[]> {
    const blockedIds = new Set([
      ...this.blocks.filter((b) => b.blockerId === userId).map((b) => b.blockedId),
      ...this.blocks.filter((b) => b.blockedId === userId).map((b) => b.blockerId)
    ])
    const followingIds = new Set(this.follows.filter((f) => f.followerId === userId).map((f) => f.followingId))

    const reviewsMap = new Map<string, number>()
    for (const activity of this.weeklyActivities) {
      if (activity.userId === userId) continue
      if (blockedIds.has(activity.userId)) continue
      if (followingIds.has(activity.userId)) continue
      reviewsMap.set(activity.userId, (reviewsMap.get(activity.userId) ?? 0) + activity.reviewCount)
    }

    return [...reviewsMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, reviewsCount]) => {
        const user = this.users.find((u) => u.id === id)!
        return { id, username: user.username, image: user.image, reviewsCount }
      })
  }

  async getSuggestions(userId: string, limit = 20): Promise<UserSuggestion[]> {
    const myFollowingIds = this.follows.filter((f) => f.followerId === userId).map((f) => f.followingId)
    const blockedIds = this.blocks.filter((b) => b.blockerId === userId).map((b) => b.blockedId)
    const blockedByIds = this.blocks.filter((b) => b.blockedId === userId).map((b) => b.blockerId)
    const excluded = new Set([userId, ...myFollowingIds, ...blockedIds, ...blockedByIds])

    const mutualCountMap = new Map<string, number>()

    for (const followingId of myFollowingIds) {
      const theirFollowings = this.follows.filter((f) => f.followerId === followingId).map((f) => f.followingId)
      for (const candidateId of theirFollowings) {
        if (!excluded.has(candidateId)) {
          mutualCountMap.set(candidateId, (mutualCountMap.get(candidateId) ?? 0) + 1)
        }
      }
    }

    return [...mutualCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, mutualCount]) => {
        const user = this.users.find((u) => u.id === id)!
        return { id, username: user.username, image: user.image, mutualCount }
      })
  }

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

  addFollow(followerId: string, followingId: string) {
    this.follows.push({ followerId, followingId })
  }

  addWeeklyActivity(userId: string, isoYear: number, isoWeek: number, reviewCount: number) {
    this.weeklyActivities.push({ userId, isoYear, isoWeek, reviewCount })
  }

  reset() {
    this.users = []
    this.blocks = []
    this.follows = []
    this.weeklyActivities = []
  }

  seed(users: Users[]) {
    this.users = [...users]
  }

  getAll() {
    return [...this.users]
  }
}
