export class FollowRequestAlreadyProcessedException extends Error {
  constructor(public readonly followRequestId: string) {
    super(`Follow request ${followRequestId} already accept`)
    this.name = 'FollowRequestAlreadyProcessedException'
  }
}
