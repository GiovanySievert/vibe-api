import { db } from '@src/infra/database/client'
import { PlaceLocationsRepository } from '../../domain/repositories/place-locations.repository'
import { PlaceLocation } from '../../domain/mappers'
import { placeLocations } from '@src/infra/database/schema'

export class DrizzlePlaceLocationsRepository implements PlaceLocationsRepository {
  async create(data: PlaceLocation): Promise<PlaceLocation> {
    const [result] = await db.insert(placeLocations).values(data).returning()

    return result
  }
}
