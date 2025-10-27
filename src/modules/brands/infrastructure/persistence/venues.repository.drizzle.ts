import { VenuesRepository } from '../../domain/repositories/venues.repository'
import { venues } from '../../application'
import { db } from '@src/infra/database/client'
import { Venues } from '../../domain/mappers'

export class DrizzleVenuesRepository implements VenuesRepository {
  async create(data: Venues): Promise<Venues> {
    const [result] = await db.insert(venues).values(data).returning()

    return result
  }

  // async update(data: any): Promise<any> {}
  // async delete(data: any): Promise<any> {}
}
