export class InvalidPlaceDataException extends Error {
  constructor(public readonly reason: string) {
    super(`Invalid place data: ${reason}`)
    this.name = 'InvalidPlaceDataException'
  }
}
