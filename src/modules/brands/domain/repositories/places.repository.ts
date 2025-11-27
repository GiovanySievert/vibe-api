import { Place } from '../mappers'

export interface PlacesRepository {
  create(data: any): Promise<Place>
  getById(placeId: string): Promise<Place>
  // update(data: any): Promise<Place>
  // delete(data: any): Promise<void>
}
