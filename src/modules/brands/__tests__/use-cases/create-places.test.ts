import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { CreatePlace } from '../../application/use-cases/create-places'
import { PlacesRepository } from '../../domain/repositories/places.repository'
import { Place } from '../../domain/mappers'
import { BrandRepository } from '../../domain/repositories'
import { BrandNotFoundException, InvalidPlaceDataException } from '../../domain/exceptions'

const makePlace = (overrides: Partial<Place> = {}): Place => ({
  id: crypto.randomUUID(),
  brandId: 'brand-123',
  name: 'Downtown Branch',
  priceRange: '$$',
  paymentMethods: 'Credit, Debit',
  socialInstagram: '@brand',
  socialTiktok: '@brand',
  contactPhone: '+5511999999999',
  about: 'About text',
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

describe('CreatePlace', () => {
  let repository: PlacesRepository
  let brandRepository: BrandRepository
  let createMock: ReturnType<typeof mock>
  let useCase: CreatePlace

  beforeEach(() => {
    createMock = mock(async (data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) =>
      makePlace(data)
    )
    repository = {
      create: createMock,
      getById: mock(async () => null),
      findAllPaginated: mock(async () => []),
      count: mock(async () => 0)
    } as unknown as PlacesRepository
    brandRepository = {
      getById: mock(async (brandId: string) => ({ id: brandId })),
      findByTaxId: mock(async () => null),
      create: mock(async () => {
        throw new Error('not used')
      })
    } as unknown as BrandRepository
    useCase = new CreatePlace(repository, brandRepository)
  })

  it('forwards a fully populated place payload to the repository', async () => {
    const payload = {
      brandId: 'brand-abc',
      name: 'Riverside',
      priceRange: '$$$',
      paymentMethods: 'All',
      socialInstagram: '@riverside',
      socialTiktok: '@riverside',
      contactPhone: '+5511988887777',
      about: 'Great place',
      status: 'pending'
    } as unknown as Omit<Place, 'id' | 'createdAt' | 'updatedAt'>

    const result = await useCase.execute(payload)

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith(payload)
    expect(result.brandId).toBe('brand-abc')
    expect(result.name).toBe('Riverside')
    expect(result.about).toBe('Great place')
    expect(result.id).toBeDefined()
  })

  it('accepts a minimal payload with optional fields set to null', async () => {
    const payload = {
      brandId: 'brand-min',
      name: 'Tiny',
      priceRange: null,
      paymentMethods: null,
      socialInstagram: null,
      socialTiktok: null,
      contactPhone: null,
      about: null,
      status: 'pending'
    } as unknown as Omit<Place, 'id' | 'createdAt' | 'updatedAt'>

    const result = await useCase.execute(payload)

    expect(createMock).toHaveBeenCalledWith(payload)
    expect(result.name).toBe('Tiny')
    expect(result.priceRange).toBeNull()
    expect(result.about).toBeNull()
  })

  it('throws BrandNotFoundException when brand does not exist', async () => {
    const missingBrandRepository = {
      ...brandRepository,
      getById: mock(async () => null)
    } as unknown as BrandRepository
    const useCaseWithMissingBrand = new CreatePlace(repository, missingBrandRepository)

    await expect(
      useCaseWithMissingBrand.execute({
        brandId: 'missing-brand',
        name: 'X',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null,
        status: 'pending'
      } as unknown as Omit<Place, 'id' | 'createdAt' | 'updatedAt'>)
    ).rejects.toThrow(BrandNotFoundException)
  })

  it('throws InvalidPlaceDataException when required fields are blank', async () => {
    await expect(
      useCase.execute({
        brandId: 'brand-abc',
        name: '   ',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null,
        status: 'pending'
      } as unknown as Omit<Place, 'id' | 'createdAt' | 'updatedAt'>)
    ).rejects.toThrow(InvalidPlaceDataException)
  })

  it('propagates repository failures to the caller', async () => {
    const failingRepository: PlacesRepository = {
      create: mock(async () => {
        throw new Error('insert failed')
      }),
      getById: mock(async () => null),
      findAllPaginated: mock(async () => []),
      count: mock(async () => 0)
    } as unknown as PlacesRepository
    const failingUseCase = new CreatePlace(failingRepository, brandRepository)

    await expect(
      failingUseCase.execute({
        brandId: 'missing-brand',
        name: 'X',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null,
        status: 'pending'
      } as unknown as Omit<Place, 'id' | 'createdAt' | 'updatedAt'>)
    ).rejects.toThrow('insert failed')
  })
})
