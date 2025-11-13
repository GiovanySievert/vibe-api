import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { DrizzleFollowRequestRepository } from '../../infrastructure/persistence'
import { FollowRequestController } from '../controllers/follow-request.controller'
import { CreateFollowRequest, ListFollowRequest, UpdateFollowRequest } from '../../application/queries'

import { validateUpdateFollowRequest } from '../dtos'

export const FollowRoutes = (app: Elysia) => {
  const repository = new DrizzleFollowRequestRepository()
  const controller = new FollowRequestController(
    new CreateFollowRequest(repository),
    new UpdateFollowRequest(repository),
    new ListFollowRequest(repository)
  )

  return app.use(authMiddleware).group('/follow', (app) =>
    app
      .get('/', (ctx: any) => controller.list(ctx), {
        auth: true,
        detail: {
          tags: ['Follow'],
          summary: 'List all user Follow request',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:requestedId', (ctx: any) => controller.create(ctx), {
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
      .patch('/:requestFollowId', (ctx: any) => controller.update(ctx), {
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
