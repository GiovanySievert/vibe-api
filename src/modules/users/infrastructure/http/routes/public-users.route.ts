import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { UsersModule } from '@src/modules/users/users.module'

export const PublicUsersRoute = (app: Elysia) => {
  const { controller } = new UsersModule()

  return app.use(authMiddleware).group('/public-users', (app) =>
    app
      .get('/trending', (ctx) => controller.getTrending(ctx), {
        auth: true,
        detail: {
          tags: ['Public Users'],
          summary: 'Get trending users (most active in last 4 weeks)',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/suggestions', (ctx) => controller.getSuggestions(ctx), {
        auth: true,
        detail: {
          tags: ['Public Users'],
          summary: 'Get user suggestions (friends of friends)',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:userId', (ctx) => controller.getById(ctx), {
        auth: true,
        params: t.Object({ userId: t.String() }),
        detail: {
          tags: ['Public Users'],
          summary: 'Get a user by Id',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/username/:username', (ctx) => controller.getByUsername(ctx), {
        auth: true,
        params: t.Object({ username: t.String() }),
        detail: {
          tags: ['Public Users'],
          summary: 'Get a user by username',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
