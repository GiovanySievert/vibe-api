import { Elysia, t } from 'elysia'

import { GetVenue } from '@src/modules/brands/application/queries'
import { DrizzleVenuesRepository } from '@src/modules/brands/infrastructure/persistence'

export const venuesRoutes = (app: Elysia) => {
  const venueRepo = new DrizzleVenuesRepository()
  const getVenueService = new GetVenue(venueRepo)

  return app.group('/venues', (app) =>
    app.get(
      '/:venueId',
      async ({ params }) => {
        const venue = await getVenueService.execute(params.venueId)

        return venue
      },
      {
        params: t.Object({
          venueId: t.Number()
        }),
        detail: {
          tags: ['venues'],
          summary: 'get a new venue',
          description: 'get a new venue'
        }
      }
    )
  )
}
