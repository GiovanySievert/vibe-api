import { Brand, BrandWithRelations } from '../mappers'

export interface BrandRepository {
  getById(brandId: string): Promise<BrandWithRelations | null>
  findByTaxId(taxId: string): Promise<Brand | null>
  create(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand>
}
