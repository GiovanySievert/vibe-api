import { Brand } from '../mappers'

export interface BrandRepository {
  getById(brandId: number): Promise<Brand>
  create(data: any): Promise<Brand>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
