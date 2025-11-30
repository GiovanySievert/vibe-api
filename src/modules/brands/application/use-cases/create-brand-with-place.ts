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
    const brand = await this.createBrandService.execute(data.brand)

    const brandMenu = await this.createBrandMenusService.execute({
      brandId: brand.id,
      menus: data.brandMenus
    })

    const place = await this.createPlaceService.execute({
      brandId: brand.id,
      ...data.place
    })

    const placeLocation = await this.createPlaceLocationService.execute({
      placeId: place.id,
      ...data.placeLocation
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
