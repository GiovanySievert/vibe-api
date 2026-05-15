import { BrandWithRelations } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories'
import { BrandNotFoundException } from '../../domain/exceptions'

export class GetBrand {
  constructor(private readonly brandsRepo: BrandRepository) {}

  async execute(brandId: string): Promise<BrandWithRelations> {
    const brand = await this.brandsRepo.getById(brandId)

    if (!brand) {
      throw new BrandNotFoundException(brandId)
    }

    return brand
  }
}
