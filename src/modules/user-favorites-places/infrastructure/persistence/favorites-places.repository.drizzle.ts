import { userFavoritesPlaces } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories/user-favorites-places.repository'
import { and, eq } from 'drizzle-orm'
import { GetUserFavoritesPlacesByIdDto } from '../../infrastructure/http/dtos'
import { brands, places } from '@src/infra/database/schema'

export class DrizzleUserFavoritesPlacesRepository implements UserFavoritesPlacesRepository {
  async create(data: Omit<UserFavoritesPlaces, 'id' | 'createdAt'>): Promise<UserFavoritesPlaces> {
    const [result] = await db.insert(userFavoritesPlaces).values(data).returning()

    return result
  }

  async delete(data: Pick<UserFavoritesPlaces, 'userId' | 'placeId'>): Promise<void> {
    await db
      .delete(userFavoritesPlaces)
      .where(and(eq(userFavoritesPlaces.userId, data.userId), eq(userFavoritesPlaces.placeId, data.placeId)))
  }

  async list(userId: string): Promise<GetUserFavoritesPlacesByIdDto[]> {
    const result = await db
      .select({
        user_favorites_places: {
          id: userFavoritesPlaces.id,
          placeId: userFavoritesPlaces.placeId,
          createdAt: userFavoritesPlaces.createdAt
        },
        places: {
          id: places.id,
          name: places.name
        },
        brand: {
          id: brands.id,
          avatar: brands.avatar
        }
      })
      .from(userFavoritesPlaces)
      .leftJoin(places, eq(userFavoritesPlaces.placeId, places.id))
      .leftJoin(brands, eq(places.brandId, brands.id))
      .where(eq(userFavoritesPlaces.userId, userId))

    return GetUserFavoritesPlacesByIdDto.fromArray(result)
  }
}
