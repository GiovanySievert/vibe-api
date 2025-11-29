import { PlaceLocation } from '../../domain/mappers'
import { PlaceLocationsRepository } from '../../domain/repositories/place-locations.repository'

export type CreatePlaceLocationData = Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>

export class CreatePlaceLocation {
  constructor(private readonly placeLocationRepository: PlaceLocationsRepository) {}

  async execute(data: CreatePlaceLocationData): Promise<PlaceLocation> {
    const placeLocation = await this.placeLocationRepository.create(data)
    return placeLocation
  }
}
