import {
  CreateBrandWithPlace,
  GetBrand
} from '@src/modules/brands/application/use-cases'
import type { CreateAllEntitiesDTO } from '../dtos/create-brand.dto'
import { appLogger } from '@src/config/logger'
import { TaxIdAlreadyExistsException } from '@src/modules/brands/domain/exceptions'

export class BrandsController {
  constructor(
    private readonly createBrandWithPlace: CreateBrandWithPlace,
    private readonly getBrandService: GetBrand
  ) {}

  async create({ body }: { body: CreateAllEntitiesDTO }) {
    try {
      const result = await this.createBrandWithPlace.execute(body)
      return result
    } catch (error) {
      if (error instanceof TaxIdAlreadyExistsException) {
        appLogger.error('Tax ID already exists', {
          taxId: error.taxId,
          brandName: body.brand.name,
          error
        })
        throw error
      }

      appLogger.error('Failed to create brand with place', {
        brandName: body.brand.name,
        error
      })
      throw error
    }
  }

  async getById({ params }: { params: { brandId: string } }) {
    try {
      const brand = await this.getBrandService.execute(params.brandId)
      return brand
    } catch (error) {
      appLogger.error('Failed to get brand by id', {
        brandId: params.brandId,
        error
      })
      throw error
    }
  }
}
