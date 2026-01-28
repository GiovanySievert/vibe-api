export class PlaceReviewAlreadyExistsException extends Error {
  constructor() {
    super('User has already reviewed this place')
    this.name = 'PlaceReviewAlreadyExistsException'
  }
}
