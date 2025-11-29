import { Place } from '../../domain/mappers'
import { PlacesRepository } from '../../domain/repositories/places.repository'

export type CreatePlaceData = Omit<Place, 'id' | 'createdAt' | 'updatedAt'>

export class CreatePlace {
  constructor(private readonly placeRepository: PlacesRepository) {}

  async execute(data: CreatePlaceData): Promise<Place> {
    const place = await this.placeRepository.create(data)
    return place
  }
}
