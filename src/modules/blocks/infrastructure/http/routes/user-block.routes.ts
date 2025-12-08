import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { BlocksModule } from '../../../blocks.module'

export const UserBlockRoutes = (app: Elysia) => {
  const { userBlockController } = new BlocksModule()

  return app.use(authMiddleware).group('/blocks', (app) =>
    app
      .post('/:userId', (ctx) => userBlockController.block(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['User Blocks'],
          summary: 'Block a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:userId', (ctx) => userBlockController.unblock(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['User Blocks'],
          summary: 'Unblock a user',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/:userId/status', (ctx) => userBlockController.checkStatus(ctx), {
        auth: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['User Blocks'],
          summary: 'Check if a user is blocked',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/', (ctx) => userBlockController.list(ctx), {
        auth: true,
        detail: {
          tags: ['User Blocks'],
          summary: 'List all blocked users',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
