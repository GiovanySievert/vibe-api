import { Place, PlaceWithRelations } from '../mappers'

export interface PlacesRepository {
  create(data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<Place>
  getById(placeId: string): Promise<PlaceWithRelations | []>
}
