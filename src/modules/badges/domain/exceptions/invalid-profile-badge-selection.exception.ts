export class InvalidProfileBadgeSelectionException extends Error {
  constructor() {
    super('Profile badge selection must contain only earned badges')
    this.name = 'InvalidProfileBadgeSelectionException'
  }
}
