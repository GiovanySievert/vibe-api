import { Elysia, t } from 'elysia'
import { BrandsModule } from '../../../brands.module'

export const placesRoutes = (app: Elysia) => {
  const { getPlaceService } = new BrandsModule()

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
