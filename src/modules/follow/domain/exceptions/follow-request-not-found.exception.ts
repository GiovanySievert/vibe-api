export class FollowRequestNotFoundException extends Error {
  constructor(public readonly followRequestId: string) {
    super(`Follow request with ID ${followRequestId} not found`)
    this.name = 'FollowRequestNotFoundException'
  }
}
