import { describe, it, expect, beforeEach } from 'bun:test'
import { GetBrand } from '../../application/use-cases/get-brand'
import { MockBrandRepository } from '../mocks/brands.repository.mock'
import { BrandNotFoundException } from '../../domain/exceptions/brand-not-found.exception'
import { Brand } from '../../domain/mappers'

describe('GetBrand', () => {
  let repository: MockBrandRepository
  let useCase: GetBrand

  beforeEach(() => {
    repository = new MockBrandRepository()
    useCase = new GetBrand(repository)
  })

  it('should return brand by id', async () => {
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

    const result = await useCase.execute(brand.id)

    expect(result).toBeDefined()
    expect(result.id).toBe(brand.id)
    expect(result.name).toBe(brand.name)
    expect(result.taxId).toBe(brand.taxId)
  })

  it('should throw BrandNotFoundException when brand does not exist', async () => {
    const nonExistentId = crypto.randomUUID()

    await expect(useCase.execute(nonExistentId)).rejects.toThrow(BrandNotFoundException)
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

    const result = await useCase.execute(brands[1].id)

    expect(result.id).toBe(brands[1].id)
    expect(result.name).toBe('Brand 2')
  })
})
