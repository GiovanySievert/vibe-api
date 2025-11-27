import { Place } from '../../domain/mappers'
import { PlacesRepository } from '../../domain/repositories/places.repository'

export class CreatePlace {
  constructor(private readonly placeRepository: PlacesRepository) {}

  async execute(data: any): Promise<Place> {
    const place = await this.placeRepository.create(data)
    return place
  }
}
