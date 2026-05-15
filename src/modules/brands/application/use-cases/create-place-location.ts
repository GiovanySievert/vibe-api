import { PlaceLocation } from '../../domain/mappers'
import { PlaceLocationsRepository } from '../../domain/repositories/place-locations.repository'
import { PlaceLocationCoordinates } from '../../domain/value-objects'

export type CreatePlaceLocationData = Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt' | 'lat' | 'lng'> & {
  lat: string | number
  lng: string | number
}

export class CreatePlaceLocation {
  constructor(private readonly placeLocationRepository: PlaceLocationsRepository) {}

  async execute(data: CreatePlaceLocationData): Promise<PlaceLocation> {
    const coordinates = PlaceLocationCoordinates.create(data.lat, data.lng)

    const placeLocation = await this.placeLocationRepository.create({
      ...data,
      lat: coordinates.lat,
      lng: coordinates.lng
    })
    return placeLocation
  }
}
