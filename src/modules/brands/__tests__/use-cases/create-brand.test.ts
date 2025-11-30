import { describe, it, expect, beforeEach } from 'bun:test'
import { CreateBrand } from '../../application/use-cases/create-brands'
import { MockBrandRepository } from '../mocks/brands.repository.mock'
import { TaxIdAlreadyExistsException } from '../../domain/exceptions'

describe('CreateBrand', () => {
  let repository: MockBrandRepository
  let useCase: CreateBrand

  beforeEach(() => {
    repository = new MockBrandRepository()
    useCase = new CreateBrand(repository)
  })

  it('should create a new brand', async () => {
    const data = {
      name: 'Test Brand',
      taxId: '12345678901234',
      type: 'Restaurant',
      avatar: null
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.name).toBe(data.name)
    expect(result.taxId).toBe(data.taxId)
    expect(result.type).toBe(data.type)
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(result.updatedAt).toBeInstanceOf(Date)
  })

  it('should add brand to repository', async () => {
    const data = {
      name: 'Test Brand',
      taxId: '12345678901234',
      type: 'Restaurant',
      avatar: null
    }

    await useCase.execute(data)

    const brands = repository.getAll()
    expect(brands).toHaveLength(1)
    expect(brands[0].name).toBe(data.name)
    expect(brands[0].taxId).toBe(data.taxId)
  })

  it('should throw error when taxId already exists', async () => {
    const data = {
      name: 'Test Brand',
      taxId: '12345678901234',
      type: 'Restaurant',
      avatar: null
    }

    await useCase.execute(data)

    await expect(useCase.execute(data)).rejects.toThrow(TaxIdAlreadyExistsException)
  })

  it('should allow multiple brands with different taxIds', async () => {
    await useCase.execute({
      name: 'Brand 1',
      taxId: '11111111111111',
      type: 'Restaurant',
      avatar: null
    })

    await useCase.execute({
      name: 'Brand 2',
      taxId: '22222222222222',
      type: 'Cafe',
      avatar: null
    })

    const brands = repository.getAll()
    expect(brands).toHaveLength(2)
  })
})
