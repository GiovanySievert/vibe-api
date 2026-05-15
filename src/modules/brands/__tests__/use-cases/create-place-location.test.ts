import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { CreatePlaceLocation } from '../../application/use-cases/create-place-location'
import { PlaceLocationsRepository } from '../../domain/repositories/place-locations.repository'
import { PlaceLocation } from '../../domain/mappers'

const makePlaceLocation = (overrides: Partial<PlaceLocation> = {}): PlaceLocation => ({
  id: crypto.randomUUID(),
  placeId: 'place-123',
  addressLine: 'Main Street',
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
  updatedAt: new Date(),
  ...overrides
})

describe('CreatePlaceLocation', () => {
  let repository: PlaceLocationsRepository
  let createMock: ReturnType<typeof mock>
  let useCase: CreatePlaceLocation

  beforeEach(() => {
    createMock = mock(async (data: Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>) =>
      makePlaceLocation(data)
    )
    repository = { create: createMock } as unknown as PlaceLocationsRepository
    useCase = new CreatePlaceLocation(repository)
  })

  it('normalizes valid coordinates before persisting', async () => {
    const payload = {
      placeId: 'place-abc',
      addressLine: 'Avenida Paulista',
      addressLine2: 'Floor 5',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      postalCode: '01310-100',
      lat: -23.561414,
      lng: -46.655881
    } as unknown as Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>

    const result = await useCase.execute(payload)

    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledWith({
      ...payload,
      lat: '-23.561414',
      lng: '-46.655881'
    })
    expect(result.placeId).toBe('place-abc')
    expect(result.addressLine).toBe('Avenida Paulista')
    expect(result.lat).toBe('-23.561414')
    expect(result.lng).toBe('-46.655881')
    expect(result.id).toBeDefined()
  })

  it('accepts boundary coordinates', async () => {
    const boundaryPayload = {
      placeId: 'place-boundary',
      addressLine: 'Edge',
      addressLine2: null,
      number: null,
      neighborhood: null,
      city: 'City',
      state: 'ST',
      country: 'Country',
      postalCode: null,
      lat: 90,
      lng: -180
    } as unknown as Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>

    const result = await useCase.execute(boundaryPayload)

    expect(createMock).toHaveBeenCalledWith({
      ...boundaryPayload,
      lat: '90.000000',
      lng: '-180.000000'
    })
    expect(result.lat).toBe('90.000000')
    expect(result.lng).toBe('-180.000000')
    expect(result.addressLine2).toBeNull()
    expect(result.neighborhood).toBeNull()
  })

  it('propagates repository failures to the caller', async () => {
    const failingRepository: PlaceLocationsRepository = {
      create: mock(async () => {
        throw new Error('foreign key violation')
      })
    } as unknown as PlaceLocationsRepository
    const failingUseCase = new CreatePlaceLocation(failingRepository)

    await expect(
      failingUseCase.execute({
        placeId: 'missing-place',
        addressLine: 'X',
        addressLine2: null,
        number: null,
        neighborhood: null,
        city: 'City',
        state: 'ST',
        country: 'Country',
        postalCode: null,
        lat: '0.000000',
        lng: '0.000000'
      } as unknown as Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>)
    ).rejects.toThrow('foreign key violation')
  })

  it('throws when coordinates are out of range', async () => {
    await expect(
      useCase.execute({
        placeId: 'place-abc',
        addressLine: 'Avenida Paulista',
        addressLine2: null,
        number: null,
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brazil',
        postalCode: '01310-100',
        lat: 91,
        lng: -46.655881
      } as unknown as Omit<PlaceLocation, 'id' | 'createdAt' | 'updatedAt'>)
    ).rejects.toThrow('Invalid place location')
  })
})
