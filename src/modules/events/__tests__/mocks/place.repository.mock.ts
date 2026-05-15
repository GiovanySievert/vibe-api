import { PlacesRepository, PlaceWithLocation } from '@src/modules/brands/domain/repositories/places.repository'
import { Place, PlaceWithRelations } from '@src/modules/brands/domain/mappers'

export class MockPlacesRepository implements PlacesRepository {
  private readonly placeIds = new Set<string>()

  async create(data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<Place> {
    const place = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Place

    this.placeIds.add(place.id)
    return place
  }

  async getById(placeId: string): Promise<PlaceWithRelations | null> {
    if (!this.placeIds.has(placeId)) {
      return null
    }

    return { id: placeId } as PlaceWithRelations
  }

  async findAllPaginated(_limit: number, _offset: number): Promise<PlaceWithLocation[]> {
    return []
  }

  async count(): Promise<number> {
    return this.placeIds.size
  }

  seed(placeIds: string[]) {
    placeIds.forEach((placeId) => this.placeIds.add(placeId))
  }
}
