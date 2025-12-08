export class CannotBlockYourselfException extends Error {
  constructor() {
    super('You cannot block yourself')
    this.name = 'CannotBlockYourselfException'
  }
}
