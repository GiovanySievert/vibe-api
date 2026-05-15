import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { CreateBrandMenus } from '../../application/use-cases/create-brand-menus'
import { BrandMenusRepository } from '../../domain/repositories/brand-menus.repository'
import { BrandMenus } from '../../domain/mappers'

const makeBrandMenu = (overrides: Partial<BrandMenus> = {}): BrandMenus => ({
  id: crypto.randomUUID(),
  brandId: 'brand-123',
  name: 'Lunch',
  description: 'Daily lunch options',
  priceCents: 1500,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

describe('CreateBrandMenus', () => {
  let repository: BrandMenusRepository
  let useCase: CreateBrandMenus
  let createMock: ReturnType<typeof mock>

  beforeEach(() => {
    createMock = mock(async (records: Omit<BrandMenus, 'id' | 'createdAt' | 'updatedAt'>[]) =>
      records.map((record) => makeBrandMenu(record))
    )
    repository = { create: createMock } as unknown as BrandMenusRepository
    useCase = new CreateBrandMenus(repository)
  })

  it('persists each menu enriched with the supplied brandId', async () => {
    const result = await useCase.execute({
      brandId: 'brand-123',
      menus: [
        { name: 'Breakfast', description: 'Morning meals', priceCents: 1000 },
        { name: 'Dinner', description: 'Evening meals', priceCents: 3000 }
      ] as unknown as Omit<BrandMenus, 'id' | 'brandId' | 'createdAt' | 'updatedAt'>[]
    })

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith([
      { brandId: 'brand-123', name: 'Breakfast', description: 'Morning meals', priceCents: 1000 },
      { brandId: 'brand-123', name: 'Dinner', description: 'Evening meals', priceCents: 3000 }
    ])
    expect(result).toHaveLength(2)
    expect(result[0].brandId).toBe('brand-123')
    expect(result[0].name).toBe('Breakfast')
    expect(result[1].name).toBe('Dinner')
  })

  it('returns an empty array and skips persistence when no menus are supplied', async () => {
    const result = await useCase.execute({
      brandId: 'brand-123',
      menus: []
    })

    expect(result).toEqual([])
    expect(createMock).not.toHaveBeenCalled()
  })

  it('propagates repository failures to the caller', async () => {
    const failingRepository: BrandMenusRepository = {
      create: mock(async () => {
        throw new Error('database unreachable')
      })
    } as unknown as BrandMenusRepository
    const failingUseCase = new CreateBrandMenus(failingRepository)

    await expect(
      failingUseCase.execute({
        brandId: 'brand-123',
        menus: [
          { name: 'Lunch', description: 'Midday', priceCents: 2000 }
        ] as unknown as Omit<BrandMenus, 'id' | 'brandId' | 'createdAt' | 'updatedAt'>[]
      })
    ).rejects.toThrow('database unreachable')
  })

  it('overrides any incoming brandId with the one passed to the use case', async () => {
    await useCase.execute({
      brandId: 'brand-canonical',
      menus: [
        {
          brandId: 'brand-attacker',
          name: 'Lunch',
          description: 'Midday',
          priceCents: 2000
        }
      ] as unknown as Omit<BrandMenus, 'id' | 'brandId' | 'createdAt' | 'updatedAt'>[]
    })

    expect(createMock).toHaveBeenCalledWith([
      { brandId: 'brand-canonical', name: 'Lunch', description: 'Midday', priceCents: 2000 }
    ])
  })
})
