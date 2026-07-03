import { Elysia, t } from 'elysia'
import { AuthModule } from '@src/modules/auth/auth.module'
import { UsernameAlreadyTakenException } from '@src/modules/auth/domain/exceptions'
import { checkUsernameQuery, parse, updateUsernameBody } from '@src/modules/auth/interface/validators'
import { authMiddleware } from '@src/shared/middlewares'

export const createAuthRoutes = (module: AuthModule) => (app: Elysia) => {
  const { checkUsernameAvailability: checkUsername, updateUsername } = module

  return app.use(authMiddleware).group('/auth', (app) =>
    app
      .get(
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
      .patch(
        '/username',
        async ({ body, user, status }) => {
          const { username } = parse(updateUsernameBody, body)
          try {
            return await updateUsername.execute(user.id, username)
          } catch (error) {
            if (error instanceof UsernameAlreadyTakenException) {
              return status(409, { message: error.message })
            }
            throw error
          }
        },
        {
          auth: true,
          body: t.Object({
            username: t.String({ minLength: 3, maxLength: 20 })
          }),
          detail: {
            tags: ['Auth'],
            summary: 'update authenticated user username',
            security: [{ cookieAuth: [] }]
          }
        }
      )
  )
}

export const authRoutes = createAuthRoutes(new AuthModule())
