import {
  CreatePlace,
  CreatePlaceLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand,
  GetPlace,
  CreateBrandWithPlace
} from './application/use-cases'
import {
  DrizzleBrandMenusRepository,
  DrizzlePlaceLocationsRepository,
  DrizzlePlacesRepository,
  DrizzleBrandRepository
} from './infrastructure/persistence'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { RabbitMQEventBus } from '@src/shared/infrastructure/rabbitmq-event-bus'
import { BrandsController } from './infrastructure/http/controllers/brands.controller'

export class BrandsModule {
  public readonly controller: BrandsController
  public readonly getPlaceService: GetPlace

  constructor() {
    const brandRepo = new DrizzleBrandRepository()
    const placeRepo = new DrizzlePlacesRepository()
    const placeLocationRepo = new DrizzlePlaceLocationsRepository()
    const brandMenusRepo = new DrizzleBrandMenusRepository()

    const producer = new RabbitMQProducer()
    const eventBus = new RabbitMQEventBus(producer)

    const createBrandService = new CreateBrand(brandRepo)
    const createBrandMenusService = new CreateBrandMenus(brandMenusRepo)
    const createPlaceService = new CreatePlace(placeRepo)
    const createPlaceLocationService = new CreatePlaceLocation(placeLocationRepo)
    const getBrandService = new GetBrand(brandRepo)
    const getPlaceService = new GetPlace(placeRepo)

    const createBrandWithPlace = new CreateBrandWithPlace(
      createBrandService,
      createBrandMenusService,
      createPlaceService,
      createPlaceLocationService,
      eventBus
    )

    this.controller = new BrandsController(createBrandWithPlace, getBrandService)
    this.getPlaceService = getPlaceService
  }
}
