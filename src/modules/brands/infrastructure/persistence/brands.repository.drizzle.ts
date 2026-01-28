import { eq } from 'drizzle-orm'

import { BrandRepository } from '@src/modules/brands/domain/repositories/brands.repository'
import { db } from '@src/infra/database/client'
import { Brand, BrandWithRelations } from '../../domain/mappers'
import { brandMenus, brands, places, placeLocations } from '@src/infra/database/schema'

export class DrizzleBrandRepository implements BrandRepository {
  async getById(brandId: string): Promise<BrandWithRelations> {
    const [brand] = await db
      .select()
      .from(brands)
      .leftJoin(brandMenus, eq(brands.id, brandMenus.brandId))
      .leftJoin(places, eq(brands.id, places.brandId))
      .leftJoin(placeLocations, eq(brands.id, places.brandId))
      .where(eq(brands.id, brandId))
      .limit(1)

    return brand
  }

  async findByTaxId(taxId: string): Promise<Brand | null> {
    const [brand] = await db.select().from(brands).where(eq(brands.taxId, taxId)).limit(1)

    return brand || null
  }

  async create(data: Brand): Promise<Brand> {
    const [result] = await db.insert(brands).values(data).returning()

    return result
  }
}
