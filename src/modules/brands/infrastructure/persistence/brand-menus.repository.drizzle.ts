import { BrandMenusRepository } from '@src/modules/brands/domain/repositories/brand-menus.repository'
import { brandMenus } from '../../application'
import { db } from '@src/infra/database/client'
import { BrandMenus } from '../../domain/mappers'

export class DrizzleBrandMenusRepository implements BrandMenusRepository {
  async create(data: BrandMenus): Promise<BrandMenus[]> {
    const result = await db.insert(brandMenus).values(data).returning()

    return result
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
