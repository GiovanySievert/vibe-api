export class CannotFollowYourselfException extends Error {
  constructor(public readonly userId: string) {
    super('Cannot follow yourself')
    this.name = 'CannotFollowYourselfException'
  }
}
