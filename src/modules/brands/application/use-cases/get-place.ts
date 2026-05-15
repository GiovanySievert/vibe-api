import { PlaceWithRelations } from '../../domain/mappers'
import { PlacesRepository } from '../../domain/repositories'
import { PlaceNotFoundException } from '../../domain/exceptions'

export class GetPlace {
  constructor(private readonly placesRepo: PlacesRepository) {}

  async execute(placeId: string): Promise<PlaceWithRelations> {
    const place = await this.placesRepo.getById(placeId)

    if (!place) {
      throw new PlaceNotFoundException(placeId)
    }

    return place
  }
}
