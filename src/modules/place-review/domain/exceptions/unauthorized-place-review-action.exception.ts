export class UnauthorizedPlaceReviewActionException extends Error {
  constructor() {
    super('You are not authorized to perform this action on this review')
    this.name = 'UnauthorizedPlaceReviewActionException'
  }
}
