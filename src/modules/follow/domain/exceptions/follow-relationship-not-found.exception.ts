export class FollowRelationshipNotFoundException extends Error {
  constructor(
    public readonly followerId: string,
    public readonly followingId: string
  ) {
    super(`Follow relationship not found between ${followerId} and ${followingId}`)
    this.name = 'FollowRelationshipNotFoundException'
  }
}
