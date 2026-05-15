import { Place, PlaceWithRelations } from '../mappers'

export interface PlaceWithLocation {
  id: string
  name: string
  type: string | null
  location: {
    lat: string
    lng: string
    neighborhood: string | null
  } | null
}

export interface PlacesRepository {
  create(data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): Promise<Place>
  getById(placeId: string): Promise<PlaceWithRelations | null>
  findAllPaginated(limit: number, offset: number): Promise<PlaceWithLocation[]>
  count(): Promise<number>
}
