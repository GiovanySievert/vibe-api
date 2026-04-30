import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { UserProfileModule } from '../../../user-profile.module'

export const UserProfileRoutes = (app: Elysia) => {
  const { userProfileController } = new UserProfileModule()

  return app.use(authMiddleware).group('/user-profile', (app) =>
    app.patch('/', (ctx) => userProfileController.update(ctx), {
      auth: true,
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        bio: t.Optional(t.String({ maxLength: 300 }))
      }),
      detail: {
        tags: ['User Profile'],
        summary: 'Update authenticated user profile',
        security: [{ cookieAuth: [] }]
      }
    })
  )
}
