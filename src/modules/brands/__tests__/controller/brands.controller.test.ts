import { describe, it, expect, beforeEach } from 'bun:test'
import { BrandsController } from '../../infrastructure/http/controllers/brands.controller'
import { GetBrand } from '../../application/use-cases/get-brand'
import { CreateBrandWithPlace } from '../../application/use-cases/create-brand-with-place'
import { MockBrandRepository } from '../mocks/brands.repository.mock'
import { Brand } from '../../domain/mappers'
import { BrandNotFoundException } from '../../domain/exceptions/brand-not-found.exception'

describe('BrandsController', () => {
  let controller: BrandsController
  let repository: MockBrandRepository

  beforeEach(() => {
    repository = new MockBrandRepository()
    const getBrandService = new GetBrand(repository)
    const createBrandWithPlace = {} as CreateBrandWithPlace

    controller = new BrandsController(createBrandWithPlace, getBrandService)
  })

  describe('getById', () => {
    it('should return brand when it exists', async () => {
      const brand: Brand = {
        id: crypto.randomUUID(),
        name: 'Test Brand',
        taxId: '12345678901234',
        type: 'Restaurant',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      repository.seed([brand])

      const result = await controller.getById({ params: { brandId: brand.id } })

      expect(result).toBeDefined()
      expect(result.id).toBe(brand.id)
      expect(result.name).toBe(brand.name)
    })

    it('should throw BrandNotFoundException when brand does not exist', async () => {
      const nonExistentId = crypto.randomUUID()

      await expect(
        controller.getById({ params: { brandId: nonExistentId } })
      ).rejects.toThrow(BrandNotFoundException)
    })

    it('should return correct brand when multiple brands exist', async () => {
      const brands: Brand[] = [
        {
          id: crypto.randomUUID(),
          name: 'Brand 1',
          taxId: '11111111111111',
          type: 'Restaurant',
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: crypto.randomUUID(),
          name: 'Brand 2',
          taxId: '22222222222222',
          type: 'Cafe',
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      repository.seed(brands)

      const result = await controller.getById({ params: { brandId: brands[1].id } })

      expect(result.id).toBe(brands[1].id)
      expect(result.name).toBe('Brand 2')
    })
  })
})
