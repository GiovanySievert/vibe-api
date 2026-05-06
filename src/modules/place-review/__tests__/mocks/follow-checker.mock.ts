import { FollowChecker } from '../../domain/repositories'

export class MockFollowChecker implements FollowChecker {
  private follows: Array<{ followerId: string; followingId: string }> = []

  addFollow(followerId: string, followingId: string) {
    this.follows.push({ followerId, followingId })
  }

  async getFollowedUserIds(followerId: string, candidateIds: string[]): Promise<Set<string>> {
    const candidateSet = new Set(candidateIds)
    return new Set(
      this.follows
        .filter((f) => f.followerId === followerId && candidateSet.has(f.followingId))
        .map((f) => f.followingId)
    )
  }

  reset() {
    this.follows = []
  }
}
