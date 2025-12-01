export class AlreadyFollowingException extends Error {
  constructor(
    public readonly followerId: string,
    public readonly followingId: string
  ) {
    super('Already following this user')
    this.name = 'AlreadyFollowingException'
  }
}
