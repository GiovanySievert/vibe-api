export interface FollowChecker {
  getFollowedUserIds(followerId: string, candidateIds: string[]): Promise<Set<string>>
}
