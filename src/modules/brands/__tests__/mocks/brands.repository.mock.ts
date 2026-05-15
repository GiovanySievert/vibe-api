import { Brand, BrandWithRelations } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories'

export class MockBrandRepository implements BrandRepository {
  private brands: Brand[] = []

  async create(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
    const newBrand: Brand = {
      id: crypto.randomUUID(),
      name: data.name,
      taxId: data.taxId,
      type: data.type,
      avatar: data.avatar,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.brands.push(newBrand)
    return newBrand
  }

  async getById(brandId: string): Promise<BrandWithRelations | null> {
    const brand = this.brands.find((b) => b.id === brandId)
    return (brand as unknown as BrandWithRelations) || null
  }

  async findByTaxId(taxId: string): Promise<Brand | null> {
    const brand = this.brands.find((b) => b.taxId === taxId)
    return brand || null
  }

  reset() {
    this.brands = []
  }

  seed(data: Brand[]) {
    this.brands = [...data]
  }

  getAll() {
    return [...this.brands]
  }
}
