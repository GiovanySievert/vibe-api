import {
  CreateVenue,
  CreateVenueLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand
} from '@src/modules/brands/application/queries'
import { RabbitMQProducer } from '@src/shared/infra/messaging'

export class BrandsController {
  constructor(
    private readonly createBrandService: CreateBrand,
    private readonly createBrandMenusService: CreateBrandMenus,
    private readonly createVenueService: CreateVenue,
    private readonly createVenueLocationService: CreateVenueLocation,
    private readonly getBrandService: GetBrand,
    private readonly producer: RabbitMQProducer
  ) {}

  async create({ body }: any) {
    const brand = await this.createBrandService.execute(body.brand)

    const brandMenu = await this.createBrandMenusService.execute({
      brandId: brand.id,
      menus: body.brandMenus
    })

    const venue = await this.createVenueService.execute({
      brandId: brand.id,
      ...body.venue
    })

    const venueLocation = await this.createVenueLocationService.execute({
      venueId: venue.id,
      ...body.venueLocation
    })

    const result = {
      brand,
      venue,
      venueLocation,
      brandMenu
    }

    const resultToBeSendedToConsumer = {
      id: venue.id,
      name: venue.name,
      location: {
        lat: venueLocation.lat,
        lon: venueLocation.lng
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
