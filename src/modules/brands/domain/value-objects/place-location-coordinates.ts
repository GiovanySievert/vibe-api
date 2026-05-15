import { InvalidPlaceLocationException } from '../exceptions'

type CoordinateInput = string | number

function normalizeCoordinate(value: CoordinateInput, field: string, min: number, max: number): string {
  const coordinate = Number(value)

  if (!Number.isFinite(coordinate) || coordinate < min || coordinate > max) {
    throw new InvalidPlaceLocationException(`${field} must be between ${min} and ${max}`)
  }

  return coordinate.toFixed(6)
}

export class PlaceLocationCoordinates {
  private constructor(
    public readonly lat: string,
    public readonly lng: string
  ) {}

  static create(lat: CoordinateInput, lng: CoordinateInput): PlaceLocationCoordinates {
    return new PlaceLocationCoordinates(
      normalizeCoordinate(lat, 'lat', -90, 90),
      normalizeCoordinate(lng, 'lng', -180, 180)
    )
  }
}
