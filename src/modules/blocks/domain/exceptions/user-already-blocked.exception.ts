export class UserAlreadyBlockedException extends Error {
  constructor() {
    super('User is already blocked')
    this.name = 'UserAlreadyBlockedException'
  }
}
