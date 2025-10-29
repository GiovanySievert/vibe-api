import { Brand } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories'

export class GetBrand {
  constructor(private readonly brandsRepo: BrandRepository) {}

  async execute(brandId: number): Promise<Brand> {
    const brand = await this.brandsRepo.getById(brandId)
    return brand
  }
}
