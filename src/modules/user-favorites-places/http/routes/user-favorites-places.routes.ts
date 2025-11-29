import Elysia, { t } from 'elysia'
import { authMiddleware } from '@src/shared/middlewares'
import { UserFavoritesPlacesModule } from '../../user-favorites-places.module'

export const userFavoritesPlacesRoutes = (app: Elysia) => {
  const { controller } = new UserFavoritesPlacesModule()

  return app.use(authMiddleware).group('/user-favorites-places', (app) =>
    app
      .get('/', (ctx) => controller.list(ctx), {
        auth: true,
        detail: {
          tags: ['User Favorites Places'],
          summary: 'get user favorite places',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:placeId', (ctx) => controller.create(ctx), {
        auth: true,
        params: t.Object({ placeId: t.String() }),
        detail: {
          tags: ['User Favorites Places'],
          summary: 'add favorite place',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:placeId', (ctx) => controller.delete(ctx), {
        auth: true,
        params: t.Object({ placeId: t.String() }),
        detail: {
          tags: ['User Favorites Places'],
          summary: 'add favorite place',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
