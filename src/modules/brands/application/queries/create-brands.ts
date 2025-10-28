import { Brand } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories/brands.repository'

export class CreateBrand {
  constructor(private readonly brandRepo: BrandRepository) {}

  async execute(data: any): Promise<Brand> {
    const brand = await this.brandRepo.create(data)
    return brand
  }
}
