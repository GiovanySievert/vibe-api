import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'

import { PublicUsersController } from '../controllers'
import { DrizzlePublicUserRepository } from '../../persistence/public-user-repository.drizzle'
import { GetPublicUserById, GetPublicUserByUsername } from '@src/modules/users/application/queries'

export const PublicUsersRoute = (app: Elysia) => {
  const repository = new DrizzlePublicUserRepository()
  const controller = new PublicUsersController(
    new GetPublicUserById(repository),
    new GetPublicUserByUsername(repository)
  )

  return app.use(authMiddleware).group('/public-users', (app) =>
    app
      .get('/:userId', (ctx: any) => controller.getById(ctx), {
        auth: true,
        params: t.Object({ userId: t.String() }),
        detail: {
          tags: ['Public Users'],
          summary: 'Get a user by Id',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/username/:username', (ctx: any) => controller.getByUsername(ctx), {
        auth: true,
        params: t.Object({ username: t.String() }),
        detail: {
          tags: ['Public Users'],
          summary: 'Get a user by username',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
