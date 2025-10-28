import { Brand } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories/brands.repository'

export class GetBrand {
  constructor(private readonly brandRepo: BrandRepository) {}

  async execute(brandId: number): Promise<Brand> {
    const brand = await this.brandRepo.getById(brandId)
    return brand
  }
}
