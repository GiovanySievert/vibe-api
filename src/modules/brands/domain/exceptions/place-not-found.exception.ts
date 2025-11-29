export class PlaceNotFoundException extends Error {
  constructor(public readonly placeId: string) {
    super(`Place with ID ${placeId} not found`)
    this.name = 'PlaceNotFoundException'
  }
}
