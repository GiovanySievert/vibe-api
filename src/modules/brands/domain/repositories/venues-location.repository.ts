import { VenueLocation } from '../mappers'

export interface VenuesLocationRepository {
  create(data: any): Promise<VenueLocation>
  // update(data: any): Promise<VenueLocation>
  // delete(data: any): Promise<void>
}
