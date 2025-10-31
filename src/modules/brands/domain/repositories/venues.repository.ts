import { Venues } from '../mappers'

export interface VenuesRepository {
  create(data: any): Promise<Venues>
  getById(venueId: string): Promise<Venues>
  // update(data: any): Promise<Venues>
  // delete(data: any): Promise<void>
}
