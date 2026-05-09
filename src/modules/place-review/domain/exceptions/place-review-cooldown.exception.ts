export class PlaceReviewCooldownException extends Error {
  readonly nextAllowedAt: Date
  readonly cooldownMinutes: number

  constructor(nextAllowedAt: Date, cooldownMinutes: number) {
    super(`You must wait before reviewing this place again`)
    this.name = 'PlaceReviewCooldownException'
    this.nextAllowedAt = nextAllowedAt
    this.cooldownMinutes = cooldownMinutes
  }
}
