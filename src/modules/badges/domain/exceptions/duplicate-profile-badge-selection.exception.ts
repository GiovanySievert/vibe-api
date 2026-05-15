export class DuplicateProfileBadgeSelectionException extends Error {
  constructor() {
    super('Profile badge selection cannot contain duplicate places')
    this.name = 'DuplicateProfileBadgeSelectionException'
  }
}
