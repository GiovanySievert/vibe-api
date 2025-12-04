import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { FollowModule } from '../../../follow.module'

export const FollowerRoutes = (app: Elysia) => {
  const { followersController } = new FollowModule()

  return app.use(authMiddleware).group('/followers', (app) =>
    app
      .get('/status/:userId', (ctx) => followersController.checkFollowStatus(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['Followers'],
          summary: 'Check follow status with a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:userId', (ctx) => followersController.unfollowUser(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['Followers'],
          summary: 'Unfollow a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:userId', (ctx) => followersController.getFollowers(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1 }))
        }),
        detail: {
          tags: ['Followers'],
          summary: 'List user followers',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/following/:userId', (ctx) => followersController.getFollowings(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        query: t.Object({
          page: t.Optional(t.Numeric({ minimum: 1 }))
        }),
        detail: {
          tags: ['Followers'],
          summary: 'List users being followed',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
