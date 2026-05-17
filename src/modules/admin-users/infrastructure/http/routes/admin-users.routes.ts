import { adminMiddleware, authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { AdminUsersModule } from '../../../admin-users.module'

export const AdminUsersRoutes = (app: Elysia) => {
  const { adminUsersController } = new AdminUsersModule()

  return app.use(authMiddleware).use(adminMiddleware).group('/admin/users', (app) =>
    app
      .get('/', (ctx) => adminUsersController.list(ctx), {
        admin: true,
        query: t.Object({
          searchValue: t.Optional(t.String()),
          limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
          offset: t.Optional(t.Numeric({ minimum: 0 }))
        }),
        detail: {
          tags: ['Admin Users'],
          summary: 'List platform users',
          security: [{ cookieAuth: [] }]
        }
      })
      .post('/:userId/ban', (ctx) => adminUsersController.ban(ctx), {
        admin: true,
        params: t.Object({
          userId: t.String()
        }),
        body: t.Object({
          banReason: t.Optional(t.String())
        }),
        detail: {
          tags: ['Admin Users'],
          summary: 'Ban a platform user',
          security: [{ cookieAuth: [] }]
        }
      })
      .delete('/:userId/ban', (ctx) => adminUsersController.unban(ctx), {
        admin: true,
        params: t.Object({
          userId: t.String()
        }),
        detail: {
          tags: ['Admin Users'],
          summary: 'Unban a platform user',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
