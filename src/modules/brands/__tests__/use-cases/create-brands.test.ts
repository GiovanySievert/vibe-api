import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { CreateBrand } from '../../application/use-cases/create-brands'
import { BrandRepository } from '../../domain/repositories'
import { Brand } from '../../domain/mappers'
import { TaxIdAlreadyExistsException } from '../../domain/exceptions'

const makeBrand = (overrides: Partial<Brand> = {}): Brand => ({
  id: crypto.randomUUID(),
  name: 'Test Brand',
  taxId: '12345678901234',
  type: 'Restaurant',
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

describe('CreateBrand (extra coverage)', () => {
  let repository: BrandRepository
  let findByTaxIdMock: ReturnType<typeof mock>
  let createMock: ReturnType<typeof mock>
  let useCase: CreateBrand

  beforeEach(() => {
    findByTaxIdMock = mock(async () => null)
    createMock = mock(async (data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) =>
      makeBrand(data)
    )
    repository = {
      findByTaxId: findByTaxIdMock,
      create: createMock,
      getById: mock(async () => makeBrand())
    } as unknown as BrandRepository
    useCase = new CreateBrand(repository)
  })

  it('skips taxId uniqueness lookup when taxId is missing', async () => {
    const result = await useCase.execute({
      name: 'No TaxId Brand',
      taxId: null,
      type: 'Cafe',
      avatar: null
    })

    expect(findByTaxIdMock).not.toHaveBeenCalled()
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(result.name).toBe('No TaxId Brand')
    expect(result.taxId).toBeNull()
  })

  it('throws TaxIdAlreadyExistsException carrying the offending taxId', async () => {
    findByTaxIdMock = mock(async () => makeBrand({ taxId: '99999999999999' }))
    repository = {
      findByTaxId: findByTaxIdMock,
      create: createMock,
      getById: mock(async () => makeBrand())
    } as unknown as BrandRepository
    useCase = new CreateBrand(repository)

    let captured: unknown
    try {
      await useCase.execute({
        name: 'Dup',
        taxId: '99999999999999',
        type: 'Restaurant',
        avatar: null
      })
    } catch (error) {
      captured = error
    }

    expect(captured).toBeInstanceOf(TaxIdAlreadyExistsException)
    expect((captured as Error).message).toContain('99999999999999')
    expect(createMock).not.toHaveBeenCalled()
  })

  it('persists the brand exactly as received once uniqueness check passes', async () => {
    const data = {
      name: 'Brand A',
      taxId: '12345678901234',
      type: 'Restaurant',
      avatar: 'https://cdn.example/a.png'
    }

    await useCase.execute(data)

    expect(findByTaxIdMock).toHaveBeenCalledWith('12345678901234')
    expect(createMock).toHaveBeenCalledWith(data)
  })

  it('propagates repository.create failures', async () => {
    createMock = mock(async () => {
      throw new Error('insert failed')
    })
    repository = {
      findByTaxId: findByTaxIdMock,
      create: createMock,
      getById: mock(async () => makeBrand())
    } as unknown as BrandRepository
    useCase = new CreateBrand(repository)

    await expect(
      useCase.execute({
        name: 'Brand',
        taxId: null,
        type: 'Cafe',
        avatar: null
      })
    ).rejects.toThrow('insert failed')
  })
})
