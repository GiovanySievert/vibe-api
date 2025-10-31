import { Elysia, t } from 'elysia'

import { DrizzleUserFavoritesPlacesRepository } from '../../infrastructure/persistence'
import { CreateUserFavoritesPlaces, GetUserFavoritesPlace } from '../../application/queries'
import { UserFavoritesPlacesRepository } from '../../domain/repositories'
import { auth } from '@src/config/auth'

export const userFavoritesPlacesRoutes = (app: Elysia) => {
  const userFavoritesRepo = new DrizzleUserFavoritesPlacesRepository()
  const getUserFavoritesPlaces = new GetUserFavoritesPlace(userFavoritesRepo)
  const createUserFavoritesPlaces = new CreateUserFavoritesPlaces(userFavoritesRepo)

  return app.group('/user-favorites-places', (app) =>
    app
      .get(
        '/',
        async ({ request }) => {
          const session = await auth.api.getSession({
            headers: request.headers
          })

          if (!session) {
            return // fix later
          }

          const userId = session.user.id
          const userFavoritesPlaces = await getUserFavoritesPlaces.execute(+userId)

          return userFavoritesPlaces
        },
        {
          detail: {
            tags: ['User Favorites Places'],
            summary: 'get user favorite places',
            description: 'get user favorite places',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .post(
        '/:placeId',
        async ({ params, request }) => {
          const session = await auth.api.getSession({
            headers: request.headers
          })

          if (!session) {
            return // fix later
          }

          const userId = session.user.id
          const { placeId } = params
          console.log(userId, placeId)
          const userFavoritesPlaces = await createUserFavoritesPlaces.execute({
            userId,
            venueId: placeId
          })

          return userFavoritesPlaces
        },
        {
          params: t.Object({
            placeId: t.String()
          }),
          detail: {
            tags: ['User Favorites Places'],
            summary: 'add favorite place',
            description: 'add favorite place',
            security: [{ cookieAuth: [] }]
          }
        }
      )
  )
}
