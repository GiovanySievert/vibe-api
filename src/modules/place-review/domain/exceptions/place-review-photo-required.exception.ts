export class PlaceReviewPhotoRequiredException extends Error {
  constructor() {
    super('A photo of the place is required to submit a review')
    this.name = 'PlaceReviewPhotoRequiredException'
  }
}
