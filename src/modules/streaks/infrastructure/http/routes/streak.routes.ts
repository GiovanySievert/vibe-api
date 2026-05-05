import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { streakController } from '../../../streak.module'

export const StreakRoutes = (app: Elysia) => {

  return app.use(authMiddleware).group('/streaks', (app) =>
    app
      .get('/me', (ctx) => streakController.getMyStreak(ctx), {
        auth: true,
        detail: {
          tags: ['Streaks'],
          summary: 'Get my streak',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:userId', (ctx) => streakController.getStreakByUserId(ctx), {
        auth: true,
        params: t.Object({ userId: t.String() }),
        detail: {
          tags: ['Streaks'],
          summary: "Get a user's streak",
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
