import { Place, PlaceWithRelations } from '../mappers'

export interface PlaceWithLocation {
  id: string
  name: string
  location: {
    lat: string
    lng: string
  } | null
}

export interface PlacesRepository {
  create(data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<Place>
  getById(placeId: string): Promise<PlaceWithRelations | []>
  findAllPaginated(limit: number, offset: number): Promise<PlaceWithLocation[]>
  count(): Promise<number>
}
