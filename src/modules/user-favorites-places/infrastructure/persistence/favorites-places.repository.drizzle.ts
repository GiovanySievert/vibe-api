import { userFavoritesPlaces } from '../../application/schemas'
import { db } from '@src/infra/database/client'
import { UserFavoritesPlaces } from '../../domain/mappers'
import { UserFavoritesPlacesRepository } from '../../domain/repositories/user-favorites-places.repository'
import { eq } from 'drizzle-orm'

export class DrizzleUserFavoritesPlacesRepository implements UserFavoritesPlacesRepository {
  async create(data: UserFavoritesPlaces): Promise<UserFavoritesPlaces> {
    const [result] = await db.insert(userFavoritesPlaces).values(data).returning()

    return result
  }

  async getByUser(userId: number): Promise<any> {
    const [result] = await db.select().from(userFavoritesPlaces).where(eq(userFavoritesPlaces.userId, +userId))

    return result
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
