import { PlaceLocation } from '../../domain/mappers'
import { PlaceLocationsRepository } from '../../domain/repositories/place-locations.repository'

export class CreatePlaceLocation {
  constructor(private readonly placeLocationRepository: PlaceLocationsRepository) {}

  async execute(data: any): Promise<PlaceLocation> {
    const placeLocation = await this.placeLocationRepository.create(data)
    return placeLocation
  }
}
