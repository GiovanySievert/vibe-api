export class PlaceReviewNotFoundException extends Error {
  constructor(reviewId?: string) {
    super(reviewId ? `Place review with id ${reviewId} not found` : 'Place review not found')
    this.name = 'PlaceReviewNotFoundException'
  }
}
