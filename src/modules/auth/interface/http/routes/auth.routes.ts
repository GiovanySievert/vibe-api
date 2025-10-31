import { CheckUsernameAvailability } from '@src/modules/auth/application/queries/check-username-availability'
import { DrizzleUserRepository } from '@src/modules/auth/infrastructure/persistence/user-repository.drizzle'
import { Elysia, t } from 'elysia'
import { parse } from 'zod'
import { checkUsernameQuery } from '../../validators'

export const authRoutes = (app: Elysia) => {
  const userRepo = new DrizzleUserRepository()
  const checkUsername = new CheckUsernameAvailability(userRepo)

  return app.group('/auth', (app) =>
    app.get(
      '/check-username',
      async ({ query }) => {
        const { username } = parse(checkUsernameQuery, query)
        return checkUsername.execute(username)
      },
      {
        query: t.Object({
          username: t.String()
        }),
        detail: {
          tags: ['Auth'],
          summary: 'check username availability',
          description: 'check if username is available for registration'
        }
      }
    )
  )
}
