import { Elysia, t } from 'elysia'
import { parse } from 'zod'
import { checkUsernameQuery } from '../../validators'
import { AuthModule } from '@src/modules/auth/auth.module'

export const authRoutes = (app: Elysia) => {
  const { checkUsernameAvailability: checkUsername } = new AuthModule()

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
