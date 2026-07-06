export class AnonymousReviewWithSelfieException extends Error {
  constructor() {
    super('Anonymous reviews cannot include a selfie')
    this.name = 'AnonymousReviewWithSelfieException'
  }
}
