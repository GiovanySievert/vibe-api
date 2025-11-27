import {
  CreatePlace,
  CreatePlaceLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand
} from '@src/modules/brands/application/queries'
import { RabbitMQProducer } from '@src/shared/infra/messaging'

export class BrandsController {
  constructor(
    private readonly createBrandService: CreateBrand,
    private readonly createBrandMenusService: CreateBrandMenus,
    private readonly createPlaceService: CreatePlace,
    private readonly createPlaceLocationService: CreatePlaceLocation,
    private readonly getBrandService: GetBrand,
    private readonly producer: RabbitMQProducer
  ) {}

  async create({ body }: any) {
    const brand = await this.createBrandService.execute(body.brand)

    const brandMenu = await this.createBrandMenusService.execute({
      brandId: brand.id,
      menus: body.brandMenus
    })

    const place = await this.createPlaceService.execute({
      brandId: brand.id,
      ...body.place
    })

    const placeLocation = await this.createPlaceLocationService.execute({
      placeId: place.id,
      ...body.placeLocation
    })

    const result = {
      brand,
      place,
      placeLocation,
      brandMenu
    }

    const resultToBeSendedToConsumer = {
      id: place.id,
      name: place.name,
      location: {
        lat: placeLocation.lat,
        lon: placeLocation.lng
      }
    }

    await this.producer.publish(resultToBeSendedToConsumer)

    return result
  }

  async getById({ params }: any) {
    const brand = await this.getBrandService.execute(params.brandId)
    return brand
  }
}
