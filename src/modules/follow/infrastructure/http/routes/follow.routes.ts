import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { FollowModule } from '../../../follow.module'

export const FollowRoutes = (app: Elysia) => {
  const { followRequestController, followersController } = new FollowModule()

  return app.use(authMiddleware).group('/follows', (app) =>
    app
      .get('/requests', (ctx) => followRequestController.list(ctx), {
        auth: true,
        detail: {
          tags: ['Follow'],
          summary: 'List all user follow requests',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:userId', (ctx) => followRequestController.create(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['Follow'],
          summary: 'Follow a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:userId', (ctx) => followersController.unfollowUser(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['Follow'],
          summary: 'Unfollow a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/requests/:requestFollowId/accept', (ctx) => followRequestController.accept(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        detail: {
          tags: ['Follow'],
          summary: 'Accept a follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/requests/:requestFollowId/reject', (ctx) => followRequestController.reject(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        detail: {
          tags: ['Follow'],
          summary: 'Reject a follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/requests/:requestFollowId', (ctx) => followRequestController.cancel(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        detail: {
          tags: ['Follow'],
          summary: 'Cancel a follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/followers', (ctx) => followersController.getFollowers(ctx), {
        auth: true,
        detail: {
          tags: ['Follow'],
          summary: 'List user followers',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/following', (ctx) => followersController.getFollowings(ctx), {
        auth: true,
        detail: {
          tags: ['Follow'],
          summary: 'List users being followed',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
