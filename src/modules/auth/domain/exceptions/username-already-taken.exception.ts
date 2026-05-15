export class UsernameAlreadyTakenException extends Error {
  constructor() {
    super('username já está em uso')
    this.name = 'UsernameAlreadyTakenException'
  }
}
