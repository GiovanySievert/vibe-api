import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { CreateBrandWithPlace } from '../../application/use-cases/create-brand-with-place'
import { CreateBrand } from '../../application/use-cases/create-brands'
import { CreateBrandMenus } from '../../application/use-cases/create-brand-menus'
import { CreatePlace } from '../../application/use-cases/create-places'
import { CreatePlaceLocation } from '../../application/use-cases/create-place-location'
import { EventBus } from '@src/shared/domain/event-bus'
import type { CreateAllEntitiesDTO } from '../../infrastructure/http/dtos/create-brand.dto'
import { Brand } from '../../domain/mappers'

describe('CreateBrandWithPlace', () => {
  let useCase: CreateBrandWithPlace
  let mockCreateBrand: CreateBrand
  let mockCreateBrandMenus: CreateBrandMenus
  let mockCreatePlace: CreatePlace
  let mockCreatePlaceLocation: CreatePlaceLocation
  let mockEventBus: EventBus

  beforeEach(() => {
    mockCreateBrand = {
      execute: mock(async (data) => ({
        id: 'brand-123',
        name: data.name,
        taxId: data.taxId,
        type: data.type,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    } as unknown as CreateBrand

    mockCreateBrandMenus = {
      execute: mock(async (data) => ({
        id: 'menu-123',
        brandId: data.brandId,
        menus: data.menus
      }))
    } as unknown as CreateBrandMenus

    mockCreatePlace = {
      execute: mock(async (data) => ({
        id: 'place-123',
        brandId: data.brandId,
        name: data.name,
        priceRange: data.priceRange,
        paymentMethods: data.paymentMethods,
        socialInstagram: data.socialInstagram,
        socialTiktok: data.socialTiktok,
        contactPhone: data.contactPhone,
        about: data.about,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    } as unknown as CreatePlace

    mockCreatePlaceLocation = {
      execute: mock(async (data) => ({
        id: 'location-123',
        placeId: data.placeId,
        addressLine: data.addressLine,
        addressLine2: data.addressLine2,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        lat: data.lat,
        lng: data.lng,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    } as unknown as CreatePlaceLocation

    mockEventBus = {
      publish: mock(async () => {})
    } as unknown as EventBus

    useCase = new CreateBrandWithPlace(
      mockCreateBrand,
      mockCreateBrandMenus,
      mockCreatePlace,
      mockCreatePlaceLocation,
      mockEventBus
    )
  })

  it('should create brand, place, location and menus successfully', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Test Restaurant',
        taxId: '12345678901234',
        type: 'Restaurant'
      },
      brandMenus: [
        { name: 'Lunch Menu', description: 'Daily lunch options' },
        { name: 'Dinner Menu', description: 'Evening dining' }
      ],
      place: {
        name: 'Downtown Branch',
        priceRange: '$$',
        paymentMethods: 'Credit, Debit',
        socialInstagram: '@testrestaurant',
        socialTiktok: '@testrestaurant',
        contactPhone: '+5511999999999',
        about: 'Great food and atmosphere'
      },
      placeLocation: {
        addressLine: 'Main Street',
        addressLine2: 'Suite 100',
        number: '123',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brazil',
        postalCode: '01234-567',
        lat: -23.5505,
        lng: -46.6333
      }
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(result.brand.id).toBe('brand-123')
    expect(result.place.id).toBe('place-123')
    expect(result.placeLocation.id).toBe('location-123')
    expect(result.brandMenu.id).toBe('menu-123')
  })

  it('should call createBrandService with correct data', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Test Brand',
        taxId: '12345678901234',
        type: 'Cafe'
      },
      brandMenus: [],
      place: {
        name: 'Main Location',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null
      },
      placeLocation: {
        addressLine: 'Street',
        addressLine2: null,
        number: null,
        neighborhood: 'Center',
        city: 'City',
        state: 'ST',
        country: 'Country',
        postalCode: '12345',
        lat: 0,
        lng: 0
      }
    }

    await useCase.execute(data)

    expect(mockCreateBrand.execute).toHaveBeenCalledWith({
      name: 'Test Brand',
      taxId: '12345678901234',
      type: 'Cafe',
      avatar: null
    })
  })

  it('should call createPlaceService with brandId from created brand', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Test Brand',
        taxId: '12345678901234',
        type: 'Restaurant'
      },
      brandMenus: [],
      place: {
        name: 'Test Place',
        priceRange: '$$$',
        paymentMethods: 'All',
        socialInstagram: '@test',
        socialTiktok: '@test',
        contactPhone: '+5511999999999',
        about: 'About text'
      },
      placeLocation: {
        addressLine: 'Street',
        addressLine2: null,
        number: null,
        neighborhood: 'Center',
        city: 'City',
        state: 'ST',
        country: 'Country',
        postalCode: '12345',
        lat: 0,
        lng: 0
      }
    }

    await useCase.execute(data)

    expect(mockCreatePlace.execute).toHaveBeenCalledWith({
      brandId: 'brand-123',
      name: 'Test Place',
      priceRange: '$$$',
      paymentMethods: 'All',
      socialInstagram: '@test',
      socialTiktok: '@test',
      contactPhone: '+5511999999999',
      about: 'About text'
    })
  })

  it('should call createPlaceLocationService with placeId from created place', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Test Brand',
        taxId: '12345678901234',
        type: 'Restaurant'
      },
      brandMenus: [],
      place: {
        name: 'Test Place',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null
      },
      placeLocation: {
        addressLine: 'Main St',
        addressLine2: 'Apt 5',
        number: '100',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brazil',
        postalCode: '01234-567',
        lat: -23.5505,
        lng: -46.6333
      }
    }

    await useCase.execute(data)

    expect(mockCreatePlaceLocation.execute).toHaveBeenCalledWith({
      placeId: 'place-123',
      addressLine: 'Main St',
      addressLine2: 'Apt 5',
      number: '100',
      neighborhood: 'Downtown',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      postalCode: '01234-567',
      lat: -23.5505,
      lng: -46.6333
    })
  })

  it('should publish brand.created event with correct data', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Test Brand',
        taxId: '12345678901234',
        type: 'Restaurant'
      },
      brandMenus: [],
      place: {
        name: 'Test Place',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null
      },
      placeLocation: {
        addressLine: 'Street',
        addressLine2: null,
        number: null,
        neighborhood: 'Center',
        city: 'City',
        state: 'ST',
        country: 'Country',
        postalCode: '12345',
        lat: -23.5505,
        lng: -46.6333
      }
    }

    await useCase.execute(data)

    expect(mockEventBus.publish).toHaveBeenCalledWith('brand.created', {
      id: 'place-123',
      name: 'Test Place',
      location: {
        lat: -23.5505,
        lon: -46.6333
      }
    })
  })

  it('should handle null values correctly', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Minimal Brand',
        taxId: '11111111111111',
        type: 'Cafe'
      },
      brandMenus: [],
      place: {
        name: 'Minimal Place',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null
      },
      placeLocation: {
        addressLine: 'Simple St',
        addressLine2: null,
        number: null,
        neighborhood: 'Area',
        city: 'Town',
        state: 'ST',
        country: 'Country',
        postalCode: '00000',
        lat: 0,
        lng: 0
      }
    }

    const result = await useCase.execute(data)

    expect(result).toBeDefined()
    expect(mockCreatePlace.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null
      })
    )
  })

  it('should call createBrandMenusService with brandId', async () => {
    const data: CreateAllEntitiesDTO = {
      brand: {
        name: 'Test Brand',
        taxId: '12345678901234',
        type: 'Restaurant'
      },
      brandMenus: [
        { name: 'Breakfast', description: 'Morning meals' },
        { name: 'Lunch', description: 'Afternoon meals' }
      ],
      place: {
        name: 'Test Place',
        priceRange: null,
        paymentMethods: null,
        socialInstagram: null,
        socialTiktok: null,
        contactPhone: null,
        about: null
      },
      placeLocation: {
        addressLine: 'Street',
        addressLine2: null,
        number: null,
        neighborhood: 'Center',
        city: 'City',
        state: 'ST',
        country: 'Country',
        postalCode: '12345',
        lat: 0,
        lng: 0
      }
    }

    await useCase.execute(data)

    expect(mockCreateBrandMenus.execute).toHaveBeenCalledWith({
      brandId: 'brand-123',
      menus: [
        { name: 'Breakfast', description: 'Morning meals' },
        { name: 'Lunch', description: 'Afternoon meals' }
      ]
    })
  })
})
