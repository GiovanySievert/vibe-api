import {
  PlacesRepository,
  PlaceWithLocation
} from '../../domain/repositories/places.repository'
import { db } from '@src/infra/database/client'
import { Place, PlaceWithRelations } from '../../domain/mappers'
import { eq, count } from 'drizzle-orm'
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

  async findAllPaginated(
    limit: number,
    offset: number
  ): Promise<PlaceWithLocation[]> {
    const result = await db.query.places.findMany({
      limit,
      offset,
      with: {
        location: true
      }
    })

    return result.map((place) => ({
      id: place.id,
      name: place.name,
      location: place.location
        ? {
            lat: place.location.lat,
            lng: place.location.lng
          }
        : null
    }))
  }

  async count(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(places)
    return result.count
  }
}
