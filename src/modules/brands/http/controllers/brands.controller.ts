import {
  CreateBrandWithPlace,
  GetBrand
} from '@src/modules/brands/application/use-cases'
import type { CreateAllEntitiesDTO } from '../dtos/create-brand.dto'

export class BrandsController {
  constructor(
    private readonly createBrandWithPlace: CreateBrandWithPlace,
    private readonly getBrandService: GetBrand
  ) {}

  async create({ body }: { body: CreateAllEntitiesDTO }) {
    const result = await this.createBrandWithPlace.execute(body)
    return result
  }

  async getById({ params }: { params: { brandId: string } }) {
    const brand = await this.getBrandService.execute(params.brandId)
    return brand
  }
}
