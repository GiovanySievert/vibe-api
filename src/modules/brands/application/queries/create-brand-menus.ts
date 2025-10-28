import { BrandMenus } from '../../domain/mappers'
import { BrandMenusRepository } from '../../domain/repositories/brand-menus.repository'

export class CreateBrandMenus {
  constructor(private readonly brandMenusRepo: BrandMenusRepository) {}

  async execute(data: any): Promise<BrandMenus[]> {
    const mappedBrandMenus = data.menus.map((brandMenu: BrandMenus) => ({
      ...brandMenu,
      brandId: data.brandId
    }))

    const brandMenus = await this.brandMenusRepo.create(mappedBrandMenus)
    return brandMenus
  }
}
