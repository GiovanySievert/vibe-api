import { Elysia } from 'elysia'

import { DrizzleBrandRepository } from '@src/modules/brands/infrastructure/persistence/brands.repository.drizzle'
import { CreateBrand } from '@src/modules/brands/application/queries/create-brand'
import { validateCreateAllEntities } from '../dtos'
import { DrizzleVenuesRepository } from '../../infrastructure/persistence/venues.repository.drizzle'
import { DrizzleVenueLocationRepository } from '../../infrastructure/persistence/venues-location.repository.drizzle'
import { CreateVenue } from '../../application/queries/create-venue'
import { CreateVenueLocation } from '../../application/queries/create-venue-location'

export const brandsRoutes = (app: Elysia) => {
  const brandRepo = new DrizzleBrandRepository()
  const venueRepo = new DrizzleVenuesRepository()
  const venueLocationRepo = new DrizzleVenueLocationRepository()

  const createBrandService = new CreateBrand(brandRepo)
  const createVenueService = new CreateVenue(venueRepo)
  const createVenueLocation = new CreateVenueLocation(venueLocationRepo)

  return app.group(
    '/brands',
    (app) =>
      app.post(
        '/',
        async ({ body }) => {
          const brand = await createBrandService.execute(body.brand)

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
            venueLocation
          }
        },
        {
          body: validateCreateAllEntities,
          detail: {
            tags: ['brands'],
            summary: 'Create a new brand with venue and location',
            description: 'Creates a complete brand entity including venue and location data'
          }
        }
      ),

    app.get('/', {})
  )
}
