import { Elysia, t } from 'elysia'

import { validateCreateAllEntities } from '../dtos'
import {
  CreatePlace,
  CreatePlaceLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand,
  CreateBrandWithPlace
} from '@src/modules/brands/application/use-cases'
import {
  DrizzleBrandMenusRepository,
  DrizzlePlaceLocationsRepository,
  DrizzlePlacesRepository,
  DrizzleBrandRepository
} from '@src/modules/brands/infrastructure/persistence'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { RabbitMQEventBus } from '@src/shared/infrastructure/rabbitmq-event-bus'
import { BrandsController } from '../controllers/brands.controller'

export const brandsRoutes = (app: Elysia) => {
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

  const createBrandWithPlace = new CreateBrandWithPlace(
    createBrandService,
    createBrandMenusService,
    createPlaceService,
    createPlaceLocationService,
    eventBus
  )

  const controller = new BrandsController(createBrandWithPlace, getBrandService)

  return app.group('/brands', (app) =>
    app
      .post('/', (ctx) => controller.create(ctx), {
        body: validateCreateAllEntities,
        detail: {
          tags: ['Brands'],
          summary: 'Create a new brand with place and location',
          description: 'Creates a complete brand entity including place and location data'
        }
      })
      .get('/:brandId', (ctx) => controller.getById(ctx), {
        params: t.Object({
          brandId: t.String()
        }),
        detail: {
          tags: ['Brands'],
          summary: 'Get brand by ID',
          description: 'Get brand by ID'
        }
      })
  )
}
