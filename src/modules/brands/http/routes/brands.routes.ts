import { Elysia, t } from 'elysia'

import { validateCreateAllEntities } from '../dtos'
import {
  CreateVenue,
  CreateVenueLocation,
  CreateBrand,
  CreateBrandMenus,
  GetBrand
} from '@src/modules/brands/application/queries'
import {
  DrizzleBrandMenusRepository,
  DrizzleVenueLocationRepository,
  DrizzleVenuesRepository,
  DrizzleBrandRepository
} from '@src/modules/brands/infrastructure/persistence'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { BrandsController } from '../controllers/brands.controller'

export const brandsRoutes = (app: Elysia) => {
  const brandRepo = new DrizzleBrandRepository()
  const venueRepo = new DrizzleVenuesRepository()
  const venueLocationRepo = new DrizzleVenueLocationRepository()
  const brandMenusRepo = new DrizzleBrandMenusRepository()
  const producer = new RabbitMQProducer()

  const controller = new BrandsController(
    new CreateBrand(brandRepo),
    new CreateBrandMenus(brandMenusRepo),
    new CreateVenue(venueRepo),
    new CreateVenueLocation(venueLocationRepo),
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
            summary: 'Create a new brand with venue and location',
            description: 'Creates a complete brand entity including venue and location data'
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
