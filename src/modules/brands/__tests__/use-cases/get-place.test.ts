import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { GetPlace } from '../../application/use-cases/get-place'
import { PlacesRepository } from '../../domain/repositories/places.repository'
import { PlaceWithRelations } from '../../domain/mappers'
import { PlaceNotFoundException } from '../../domain/exceptions'

const makePlaceWithRelations = (
  overrides: Partial<PlaceWithRelations> = {}
): PlaceWithRelations =>
  ({
    id: 'place-123',
    brandId: 'brand-123',
    name: 'Downtown Branch',
    priceRange: '$$',
    paymentMethods: 'Credit',
    socialInstagram: '@brand',
    socialTiktok: '@brand',
    contactPhone: '+5511999999999',
    about: 'About',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: {
      id: 'brand-123',
      name: 'Brand',
      taxId: '12345678901234',
      type: 'Restaurant',
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      menus: []
    },
    location: {
      id: 'location-123',
      placeId: 'place-123',
      addressLine: 'Main St',
      addressLine2: null,
      number: '100',
      neighborhood: 'Downtown',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      postalCode: '01234-567',
      lat: '-23.550500',
      lng: '-46.633300',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ...overrides
  }) as PlaceWithRelations

describe('GetPlace', () => {
  let repository: PlacesRepository
  let getByIdMock: ReturnType<typeof mock>
  let useCase: GetPlace

  beforeEach(() => {
    getByIdMock = mock(async () => null)
    repository = {
      getById: getByIdMock,
      create: mock(async () => {
        throw new Error('not used')
      }),
      findAllPaginated: mock(async () => []),
      count: mock(async () => 0)
    } as unknown as PlacesRepository
    useCase = new GetPlace(repository)
  })

  it('returns the place with its relations when it exists', async () => {
    const place = makePlaceWithRelations()
    getByIdMock = mock(async () => place)
    repository = {
      getById: getByIdMock,
      create: mock(async () => {
        throw new Error('not used')
      }),
      findAllPaginated: mock(async () => []),
      count: mock(async () => 0)
    } as unknown as PlacesRepository
    useCase = new GetPlace(repository)

    const result = await useCase.execute('place-123')

    expect(getByIdMock).toHaveBeenCalledWith('place-123')
    expect(Array.isArray(result)).toBe(false)
    const placeResult = result as PlaceWithRelations
    expect(placeResult.id).toBe('place-123')
    expect(placeResult.brand.id).toBe('brand-123')
    expect(placeResult.location.city).toBe('São Paulo')
  })

  it('throws PlaceNotFoundException when the place is not found', async () => {
    await expect(useCase.execute('missing-place')).rejects.toThrow(PlaceNotFoundException)

    expect(getByIdMock).toHaveBeenCalledWith('missing-place')
  })

  it('propagates repository errors to the caller', async () => {
    const failingRepository: PlacesRepository = {
      getById: mock(async () => {
        throw new Error('db down')
      }),
      create: mock(async () => {
        throw new Error('not used')
      }),
      findAllPaginated: mock(async () => []),
      count: mock(async () => 0)
    } as unknown as PlacesRepository
    const failingUseCase = new GetPlace(failingRepository)

    await expect(failingUseCase.execute('place-123')).rejects.toThrow('db down')
  })
})
