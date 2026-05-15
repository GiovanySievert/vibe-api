export class ProfileBadgeSelectionLimitException extends Error {
  constructor() {
    super('You can show up to 3 badges on your profile')
    this.name = 'ProfileBadgeSelectionLimitException'
  }
}
