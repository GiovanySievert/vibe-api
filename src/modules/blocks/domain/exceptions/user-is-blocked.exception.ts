export class UserIsBlockedException extends Error {
  constructor() {
    super('Cannot perform this action because the user is blocked')
    this.name = 'UserIsBlockedException'
  }
}
