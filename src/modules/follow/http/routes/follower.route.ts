import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { DrizzleFollowRepository, DrizzleFollowRequestRepository } from '../../infrastructure/persistence'
import { FollowersController } from '../controllers/followers.controller'
import { IsFollowing } from '../../application/queries'

export const FollowerRoutes = (app: Elysia) => {
  const repository = new DrizzleFollowRepository()
  const controller = new FollowersController(new IsFollowing(repository))

  return app.use(authMiddleware).group('/follow', (app) =>
    app.get('/:userId', (ctx: any) => controller.checkIsFollowing(ctx), {
      auth: true,
      detail: {
        tags: ['Follow'],
        params: t.Object({
          userId: t.String()
        }),
        summary: 'Check if a user follows another',
        security: [{ cookieAuth: [] }]
      }
    })
  )
}
