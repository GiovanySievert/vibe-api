import Elysia, { t } from 'elysia'

import { CreateUserFavoritesPlaces, GetUserFavoritesPlace, DeleteUserFavoritesPlaces } from '../../application/queries'
import { UserFavoritesController } from '../controllers/user-favorites-places.controller'
import { DrizzleUserFavoritesPlacesRepository } from '../../infrastructure/persistence'
import { authMiddleware } from '@src/shared/middlewares'
import { auth } from '@src/config/auth'

export const userFavoritesPlacesRoutes = (app: Elysia) => {
  const repository = new DrizzleUserFavoritesPlacesRepository()
  const controller = new UserFavoritesController(
    new GetUserFavoritesPlace(repository),
    new CreateUserFavoritesPlaces(repository),
    new DeleteUserFavoritesPlaces(repository)
  )

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
