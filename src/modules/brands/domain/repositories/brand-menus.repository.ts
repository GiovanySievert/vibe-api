import { BrandMenus } from '../mappers'

export interface BrandMenusRepository {
  create(data: BrandMenus): Promise<BrandMenus[]>
  // update(data: any): Promise<Brand>
  // delete(data: any): Promise<void>
}
