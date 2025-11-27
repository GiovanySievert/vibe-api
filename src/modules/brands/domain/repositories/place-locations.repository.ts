import { PlaceLocation } from '../mappers'

export interface PlaceLocationsRepository {
  create(data: any): Promise<PlaceLocation>
  // update(data: any): Promise<PlaceLocation>
  // delete(data: any): Promise<void>
}
