import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { FollowModule } from '../../../follow.module'

export const FollowerRoutes = (app: Elysia) => {
  const { followersController: controller } = new FollowModule()

  return app.use(authMiddleware).group('/follow', (app) =>
    app.get('/:userId', (ctx) => controller.checkIsFollowing(ctx), {
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
