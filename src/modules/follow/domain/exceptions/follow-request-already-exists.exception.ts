export class FollowRequestAlreadyExistsException extends Error {
  constructor(
    public readonly requesterId: string,
    public readonly requestedId: string
  ) {
    super('Follow request already exists')
    this.name = 'FollowRequestAlreadyExistsException'
  }
}
