import { EventBus } from '@src/shared/domain/event-bus'
import { CreateBrand } from './create-brands'
import { CreateBrandMenus } from './create-brand-menus'
import { CreatePlace } from './create-places'
import { CreatePlaceLocation } from './create-place-location'
import type { CreateAllEntitiesDTO } from '../../infrastructure/http/dtos/create-brand.dto'

export class CreateBrandWithPlace {
  constructor(
    private readonly createBrandService: CreateBrand,
    private readonly createBrandMenusService: CreateBrandMenus,
    private readonly createPlaceService: CreatePlace,
    private readonly createPlaceLocationService: CreatePlaceLocation,
    private readonly eventBus: EventBus
  ) {}

  async execute(data: CreateAllEntitiesDTO) {
    const brand = await this.createBrandService.execute({
      ...data.brand,
      avatar: null
    })

    const brandMenu = await this.createBrandMenusService.execute({
      brandId: brand.id,
      menus: data.brandMenus
    })

    const place = await this.createPlaceService.execute({
      brandId: brand.id,
      priceRange: data.place.priceRange ?? null,
      paymentMethods: data.place.paymentMethods ?? null,
      socialInstagram: data.place.socialInstagram ?? null,
      socialTiktok: data.place.socialTiktok ?? null,
      contactPhone: data.place.contactPhone ?? null,
      about: data.place.about ?? null,
      name: data.place.name
    })

    const placeLocation = await this.createPlaceLocationService.execute({
      placeId: place.id,
      addressLine: data.placeLocation.addressLine,
      addressLine2: data.placeLocation.addressLine2 ?? null,
      number: data.placeLocation.number ?? null,
      neighborhood: data.placeLocation.neighborhood,
      city: data.placeLocation.city,
      state: data.placeLocation.state,
      country: data.placeLocation.country,
      postalCode: data.placeLocation.postalCode,
      lat: data.placeLocation.lat,
      lng: data.placeLocation.lng
    })

    await this.eventBus.publish('brand.created', {
      id: place.id,
      name: place.name,
      location: {
        lat: placeLocation.lat,
        lon: placeLocation.lng
      }
    })

    return {
      brand,
      place,
      placeLocation,
      brandMenu
    }
  }
}
