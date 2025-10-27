import { db } from '@src/infra/database/client'
import { VenuesLocationRepository } from '../../domain/repositories/venues-location.repository'
import { venuesLocations } from '../../application'
import { VenueLocation } from '../../domain/mappers'

export class DrizzleVenueLocationRepository implements VenuesLocationRepository {
  async create(data: VenueLocation): Promise<VenueLocation> {
    const [result] = await db.insert(venuesLocations).values(data).returning()

    return result
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
