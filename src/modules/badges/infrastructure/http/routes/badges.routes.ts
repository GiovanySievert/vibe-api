import { Elysia, t } from 'elysia'
import { authMiddleware } from '@src/shared/middlewares'
import { BadgesModule } from '../../../badges.module'

export const BadgesRoutes = (app: Elysia) => {
  const { controller } = new BadgesModule()

  return app.use(authMiddleware).group('/badges', (app) =>
    app
      .get('/me', (ctx) => controller.listMine(ctx), {
        auth: true,
        detail: {
          tags: ['Badges'],
          summary: 'List place badges for the current user',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/user/:userId', (ctx) => controller.listByUser(ctx), {
        auth: true,
        params: t.Object({ userId: t.String() }),
        detail: {
          tags: ['Badges'],
          summary: 'List place badges for a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/user/:userId/place/:placeId', (ctx) => controller.getForPlace(ctx), {
        auth: true,
        params: t.Object({ userId: t.String(), placeId: t.String() }),
        detail: {
          tags: ['Badges'],
          summary: 'Get a user\'s badge tiers for a specific place',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
