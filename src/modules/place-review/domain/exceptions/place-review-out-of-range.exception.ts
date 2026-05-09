export class PlaceReviewOutOfRangeException extends Error {
  readonly distanceMeters: number
  readonly maxAllowedMeters: number

  constructor(distanceMeters: number, maxAllowedMeters: number) {
    super(`You are too far from the place to review it`)
    this.name = 'PlaceReviewOutOfRangeException'
    this.distanceMeters = distanceMeters
    this.maxAllowedMeters = maxAllowedMeters
  }
}
