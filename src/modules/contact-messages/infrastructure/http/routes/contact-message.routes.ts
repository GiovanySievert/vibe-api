import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { ContactMessagesModule } from '../../../contact-messages.module'

export const ContactMessageRoutes = (app: Elysia) => {
  const { contactMessageController } = new ContactMessagesModule()

  return app.use(authMiddleware).group('/contact-messages', (app) =>
    app
      .post('/', (ctx) => contactMessageController.send(ctx), {
        auth: true,
        body: t.Object({
          message: t.String({ minLength: 1, maxLength: 1000 })
        }),
        detail: {
          tags: ['Contact Messages'],
          summary: 'Send a message to the team',
          security: [{ cookieAuth: [] }]
        }
      })
      .get('/', (ctx) => contactMessageController.list(ctx), {
        auth: true,
        detail: {
          tags: ['Contact Messages'],
          summary: 'List all contact messages',
          security: [{ cookieAuth: [] }]
        }
      })
  )
}
