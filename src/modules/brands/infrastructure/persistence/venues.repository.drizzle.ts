import { VenuesRepository } from '../../domain/repositories/venues.repository'
import { db } from '@src/infra/database/client'
import { Venues } from '../../domain/mappers'
import { brandMenus, brands, venues, venuesLocations } from '../../application'
import { eq } from 'drizzle-orm'

export class DrizzleVenuesRepository implements VenuesRepository {
  async create(data: Venues): Promise<Venues> {
    const [result] = await db.insert(venues).values(data).returning()

    return result
  }

  async getById(brandId: number): Promise<Venues> {
    const [venue] = await db
      .select()
      .from(venues)
      .leftJoin(brands, eq(venues.brandId, brands.id))
      .leftJoin(brandMenus, eq(venues.brandId, brandMenus.brandId))
      .leftJoin(venuesLocations, eq(venues.brandId, venues.brandId))
      .where(eq(venues.brandId, brandId))
      .limit(1)

    return venue
  }

  // async update(data: any): Promise<any> {}
  // async delete(data: any): Promise<any> {}
}
