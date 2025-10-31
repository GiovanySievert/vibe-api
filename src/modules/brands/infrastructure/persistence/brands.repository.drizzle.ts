import { eq } from 'drizzle-orm'

import { BrandRepository } from '@src/modules/brands/domain/repositories/brands.repository'
import { db } from '@src/infra/database/client'
import { Brand } from '../../domain/mappers'
import { brandMenus, brands, venues, venuesLocations } from '@src/infra/database/schema'

export class DrizzleBrandRepository implements BrandRepository {
  async getById(brandId: string): Promise<any> {
    const [brand] = await db
      .select()
      .from(brands)
      .leftJoin(brandMenus, eq(brands.id, brandMenus.brandId))
      .leftJoin(venues, eq(brands.id, venues.brandId))
      .leftJoin(venuesLocations, eq(brands.id, venues.brandId))
      .where(eq(brands.id, brandId))
      .limit(1)

    return brand
  }

  async create(data: Brand): Promise<Brand> {
    const [result] = await db.insert(brands).values(data).returning()

    return result
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
