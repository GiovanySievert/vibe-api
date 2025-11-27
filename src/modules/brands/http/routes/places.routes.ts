import { Elysia, t } from 'elysia'

import { GetPlace } from '@src/modules/brands/application/queries'
import { DrizzlePlacesRepository } from '@src/modules/brands/infrastructure/persistence'

export const placesRoutes = (app: Elysia) => {
  const placeRepo = new DrizzlePlacesRepository()
  const getPlaceService = new GetPlace(placeRepo)

  return app.group('/places', (app) =>
    app.get(
      '/:placeId',
      async ({ params }) => {
        const place = await getPlaceService.execute(params.placeId)

        return place
      },
      {
        params: t.Object({
          placeId: t.String()
        }),
        detail: {
          tags: ['Places'],
          summary: 'Get a place by ID',
          description: 'Get a place by ID'
        }
      }
    )
  )
}
