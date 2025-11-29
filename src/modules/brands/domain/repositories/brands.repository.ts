import { Brand } from '../mappers'

export interface BrandRepository {
  getById(brandId: string): Promise<Brand>
  findByTaxId(taxId: string): Promise<Brand | null>
  create(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand>
}
