import { PlaceLocation } from '../mappers'

export interface PlaceLocationsRepository {
  create(data: Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlaceLocation>
}
