import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { FollowModule } from '../../../follow.module'

export const FollowRequestRoutes = (app: Elysia) => {
  const { followRequestController } = new FollowModule()

  return app.use(authMiddleware).group('/follow-requests', (app) =>
    app
      .get('/', (ctx) => followRequestController.list(ctx), {
        auth: true,
        detail: {
          tags: ['Follow Request'],
          summary: 'List all user follow requests',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/requested', (ctx) => followRequestController.listRequested(ctx), {
        auth: true,
        detail: {
          tags: ['Follow Request'],
          summary: 'List all user follow requests from logged user',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/send/:userId', (ctx) => followRequestController.create(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['Follow Request'],
          summary: 'Send a follow request to a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:requestFollowId/accept', (ctx) => followRequestController.accept(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        detail: {
          tags: ['Follow Request'],
          summary: 'Accept a follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:requestFollowId/reject', (ctx) => followRequestController.reject(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        detail: {
          tags: ['Follow Request'],
          summary: 'Reject a follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:requestFollowId', (ctx) => followRequestController.cancel(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        detail: {
          tags: ['Follow Request'],
          summary: 'Cancel a follow request',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
