import { userFavoritesPlaces } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories/user-favorites-places.repository'
import { eq } from 'drizzle-orm'
import { GetUserFavoritesPlacesByIdDto } from '../../http/dtos'
import { brands, venues } from '@src/infra/database/schema'

export class DrizzleUserFavoritesPlacesRepository implements UserFavoritesPlacesRepository {
  async create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces> {
    const [result] = await db.insert(userFavoritesPlaces).values(data).returning()

    return result
  }

  async list(userId: string): Promise<GetUserFavoritesPlacesByIdDto[]> {
    const result = await db
      .select({
        user_favorites_places: {
          id: userFavoritesPlaces.id,
          venueId: userFavoritesPlaces.venueId,
          createdAt: userFavoritesPlaces.createdAt
        },
        venues: {
          id: venues.id,
          name: venues.name
        },
        brand: {
          id: brands.id,
          avatar: brands.avatar
        }
      })
      .from(userFavoritesPlaces)
      .leftJoin(venues, eq(userFavoritesPlaces.venueId, venues.id))
      .leftJoin(brands, eq(venues.brandId, brands.id))
      .where(eq(userFavoritesPlaces.userId, userId))

    return GetUserFavoritesPlacesByIdDto.fromArray(result)
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
