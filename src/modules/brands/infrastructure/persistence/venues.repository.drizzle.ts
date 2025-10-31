import { VenuesRepository } from '../../domain/repositories/venues.repository'
import { db } from '@src/infra/database/client'
import { Venues } from '../../domain/mappers'
import { eq } from 'drizzle-orm'
import { venues } from '@src/infra/database/schema'

export class DrizzleVenuesRepository implements VenuesRepository {
  async create(data: Venues): Promise<Venues> {
    const [result] = await db.insert(venues).values(data).returning()

    return result
  }

  async getById(brandId: string): Promise<any> {
    const result = await db.query.venues.findFirst({
      where: eq(venues.brandId, brandId),
      with: {
        brand: {
          with: {
            menus: true
          }
        },
        location: true
      }
    })

    return result
  }

  // async update(data: any): Promise<any> {}
  // async delete(data: any): Promise<any> {}
}
