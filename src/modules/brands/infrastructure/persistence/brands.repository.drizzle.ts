import { BrandRepository } from '@src/modules/brands/domain/repositories/brands.repository'
import { brands } from '../../application'
import { db } from '@src/infra/database/client'
import { Brand } from '../../domain/mappers'

export class DrizzleBrandRepository implements BrandRepository {
  async create(data: Brand): Promise<Brand> {
    const [result] = await db.insert(brands).values(data).returning()

    return result
  }

  // async update(data: any): Promise<void> {}
  // async delete(data: any): Promise<void> {}
}
