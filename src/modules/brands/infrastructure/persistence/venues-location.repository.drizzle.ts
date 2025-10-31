import { db } from '@src/infra/database/client'
import { VenuesLocationRepository } from '../../domain/repositories/venues-location.repository'
import { VenueLocation } from '../../domain/mappers'
import { venuesLocations } from '@src/infra/database/schema'

export class DrizzleVenueLocationRepository implements VenuesLocationRepository {
  async create(data: VenueLocation): Promise<VenueLocation> {
    const [result] = await db.insert(venuesLocations).values(data).returning()

    return result
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
