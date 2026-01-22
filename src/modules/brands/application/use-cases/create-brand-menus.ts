import { BrandMenus } from '../../domain/mappers'
import { BrandMenusRepository } from '../../domain/repositories/brand-menus.repository'

export interface CreateBrandMenusData {
  brandId: string
  menus: Omit<BrandMenus, 'id' | 'brandId' | 'createdAt' | 'updatedAt'>[]
}

export class CreateBrandMenus {
  constructor(private readonly brandMenusRepo: BrandMenusRepository) {}

  async execute(data: CreateBrandMenusData): Promise<BrandMenus[]> {
    if (data.menus.length === 0) {
      return []
    }

    const mappedBrandMenus = data.menus.map((brandMenu) => ({
      ...brandMenu,
      brandId: data.brandId
    }))

    const brandMenus = await this.brandMenusRepo.create(mappedBrandMenus)
    return brandMenus
  }
}
