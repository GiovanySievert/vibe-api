export class UserNotBlockedException extends Error {
  constructor() {
    super('User is not blocked')
    this.name = 'UserNotBlockedException'
  }
}
