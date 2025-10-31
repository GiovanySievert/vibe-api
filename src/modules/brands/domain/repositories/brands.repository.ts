import { Brand } from '../mappers'

export interface BrandRepository {
  getById(brandId: string): Promise<Brand>
  create(data: any): Promise<Brand>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
