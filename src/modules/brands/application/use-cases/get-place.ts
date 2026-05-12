import { PlaceWithRelations } from '../../domain/mappers'
import { PlacesRepository } from '../../domain/repositories'

export class GetPlace {
  constructor(private readonly placesRepo: PlacesRepository) {}

  async execute(placeId: string): Promise<PlaceWithRelations | []> {
    const place = await this.placesRepo.getById(placeId)
    return place
  }
}
