export class InvalidPlaceLocationException extends Error {
  constructor(public readonly reason: string) {
    super(`Invalid place location: ${reason}`)
    this.name = 'InvalidPlaceLocationException'
  }
}
