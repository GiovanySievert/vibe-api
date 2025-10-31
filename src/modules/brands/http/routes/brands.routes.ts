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

export const brandsRoutes = (app: Elysia) => {
  const brandRepo = new DrizzleBrandRepository()
  const venueRepo = new DrizzleVenuesRepository()
  const venueLocationRepo = new DrizzleVenueLocationRepository()
  const brandMenusRepo = new DrizzleBrandMenusRepository()

  const createBrandService = new CreateBrand(brandRepo)
  const createBrandMenusService = new CreateBrandMenus(brandMenusRepo)
  const createVenueService = new CreateVenue(venueRepo)
  const createVenueLocation = new CreateVenueLocation(venueLocationRepo)

  const getBrandService = new GetBrand(brandRepo)

  return (
    app.group('/brands', (app) =>
      app.post(
        '/',
        async ({ body }) => {
          const brand = await createBrandService.execute(body.brand)

          const brandMenu = await createBrandMenusService.execute({
            brandId: brand.id,
            menus: body.brandMenus
          })

          const venue = await createVenueService.execute({
            brandId: brand.id,
            ...body.venue
          })

          const venueLocation = await createVenueLocation.execute({
            venueId: venue.id,
            ...body.venueLocation
          })

          return {
            brand,
            venue,
            venueLocation,
            brandMenu
          }
        },
        {
          body: validateCreateAllEntities,
          detail: {
            tags: ['Brands'],
            summary: 'Create a new brand with venue and location',
            description: 'Creates a complete brand entity including venue and location data'
          }
        }
      )
    ),
    app.get(
      '/:brandId',
      async ({ params }) => {
        const brand = await getBrandService.execute(params.brandId)

        return brand
      },
      {
        params: t.Object({
          brandId: t.String()
        }),
        detail: {
          tags: ['Brands'],
          summary: 'Create a new brand with venue and location',
          description: 'Creates a complete brand entity including venue and location data'
        }
      }
    )
  )
}
