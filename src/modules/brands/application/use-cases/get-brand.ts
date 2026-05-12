import { BrandWithRelations } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories'

export class GetBrand {
  constructor(private readonly brandsRepo: BrandRepository) {}

  async execute(brandId: string): Promise<BrandWithRelations> {
    const brand = await this.brandsRepo.getById(brandId)
    return brand
  }
}
