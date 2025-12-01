export class UnauthorizedFollowRequestActionException extends Error {
  constructor(
    public readonly userId: string,
    public readonly action: string
  ) {
    super(`User ${userId} is not authorized to ${action} this follow request`)
    this.name = 'UnauthorizedFollowRequestActionException'
  }
}
