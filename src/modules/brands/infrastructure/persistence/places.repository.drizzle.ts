import { PlacesRepository } from '../../domain/repositories/places.repository'
import { db } from '@src/infra/database/client'
import { Place, PlaceWithRelations } from '../../domain/mappers'
import { eq } from 'drizzle-orm'
import { places } from '@src/infra/database/schema'

export class DrizzlePlacesRepository implements PlacesRepository {
  async create(data: Place): Promise<Place> {
    const [result] = await db.insert(places).values(data).returning()

    return result
  }

  async getById(brandId: string): Promise<PlaceWithRelations | []> {
    const result = await db.query.places.findFirst({
      where: eq(places.id, brandId),
      with: {
        brand: {
          with: {
            menus: true
          }
        },
        location: true
      }
    })

    if (!result) {
      return []
    }

    return result
  }
}
