import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { FollowModule } from '../../../follow.module'

export const FollowStatsRoutes = (app: Elysia) => {
  const { followStatsController } = new FollowModule()

  return app.use(authMiddleware).group('/follow-stats', (app) =>
    app.get('/:userId', (ctx) => followStatsController.list(ctx), {
      auth: true,
      params: t.Object({
        userId: t.String()
      }),
      detail: {
        tags: ['Follow Stats'],
        summary: 'Get user follow statistics',
        security: [{ cookieAuth: [] }]
      }
    })
  )
}
