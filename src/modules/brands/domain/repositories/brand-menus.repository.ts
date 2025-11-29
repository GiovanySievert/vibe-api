import { BrandMenus } from '../mappers'

export interface BrandMenusRepository {
  create(data: Omit<BrandMenus, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<BrandMenus[]>
}
