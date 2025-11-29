import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { validateUpdateFollowRequest } from '../dtos'
import { FollowModule } from '../../follow.module'

export const FollowRoutes = (app: Elysia) => {
  const { followRequestController: controller } = new FollowModule()

  return app.use(authMiddleware).group('/follow', (app) =>
    app
      .get('', (ctx) => controller.list(ctx), {
        auth: true,
        detail: {
          tags: ['Follow'],
          summary: 'List all user Follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:requestedId', (ctx) => controller.create(ctx), {
        auth: true,
        params: t.Object({
          requestedId: t.String()
        }),
        detail: {
          tags: ['Follow'],
          summary: 'Create a Follow',
          security: [{ cookieAuth: [] }]
        }
      })
      .patch('/:requestFollowId', (ctx) => controller.update(ctx), {
        auth: true,
        params: t.Object({
          requestFollowId: t.String()
        }),
        body: validateUpdateFollowRequest,
        detail: {
          tags: ['Follow'],
          summary: 'Update a Follow ',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
