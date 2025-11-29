import { Brand } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories/brands.repository'
import { TaxIdAlreadyExistsException } from '../../domain/exceptions'

export type CreateBrandData = Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>

export class CreateBrand {
  constructor(private readonly brandRepo: BrandRepository) {}

  async execute(data: CreateBrandData): Promise<Brand> {
    const existingBrand = await this.brandRepo.findByTaxId(data.taxId)
    if (existingBrand) {
      throw new TaxIdAlreadyExistsException(data.taxId)
    }

    const brand = await this.brandRepo.create(data)
    return brand
  }
}
