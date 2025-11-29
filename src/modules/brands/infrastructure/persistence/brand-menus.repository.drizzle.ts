import { BrandMenusRepository } from '@src/modules/brands/domain/repositories/brand-menus.repository'
import { db } from '@src/infra/database/client'
import { BrandMenus } from '../../domain/mappers'
import { brandMenus } from '@src/infra/database/schema'

export class DrizzleBrandMenusRepository implements BrandMenusRepository {
  async create(data: Omit<BrandMenus, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<BrandMenus[]> {
    const result = await db.insert(brandMenus).values(data).returning()

    return result
  }
}
