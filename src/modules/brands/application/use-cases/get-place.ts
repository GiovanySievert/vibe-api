import { Place } from '../../domain/mappers'
import { PlacesRepository } from '../../domain/repositories'

export class GetPlace {
  constructor(private readonly placesRepo: PlacesRepository) {}

  async execute(placeId: string): Promise<Place> {
    const place = await this.placesRepo.getById(placeId)
    return place
  }
}
