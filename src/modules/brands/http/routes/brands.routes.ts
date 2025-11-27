import { Elysia, t } from 'elysia'

import { validateCreateAllEntities } from '../dtos'
import {
  CreatePlace,
  CreatePlaceLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand
} from '@src/modules/brands/application/queries'
import {
  DrizzleBrandMenusRepository,
  DrizzlePlaceLocationsRepository,
  DrizzlePlacesRepository,
  DrizzleBrandRepository
} from '@src/modules/brands/infrastructure/persistence'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { BrandsController } from '../controllers/brands.controller'

export const brandsRoutes = (app: Elysia) => {
  const brandRepo = new DrizzleBrandRepository()
  const placeRepo = new DrizzlePlacesRepository()
  const placeLocationRepo = new DrizzlePlaceLocationsRepository()
  const brandMenusRepo = new DrizzleBrandMenusRepository()
  const producer = new RabbitMQProducer()

  const controller = new BrandsController(
    new CreateBrand(brandRepo),
    new CreateBrandMenus(brandMenusRepo),
    new CreatePlace(placeRepo),
    new CreatePlaceLocation(placeLocationRepo),
    new GetBrand(brandRepo),
    producer
  )

  return app.group('/brands', (app) =>
    app
      .post(
        '/',
        (ctx) => controller.create(ctx),
        {
          body: validateCreateAllEntities,
          detail: {
            tags: ['Brands'],
            summary: 'Create a new brand with place and location',
            description: 'Creates a complete brand entity including place and location data'
          }
        }
      )
      .get(
        '/:brandId',
        (ctx) => controller.getById(ctx),
        {
          params: t.Object({
            brandId: t.String()
          }),
          detail: {
            tags: ['Brands'],
            summary: 'Get brand by ID',
            description: 'Get brand by ID'
          }
        }
      )
  )
}
