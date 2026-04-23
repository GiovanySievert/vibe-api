import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { EventsModule } from '../../../events.module'

export const EventRoutes = (app: Elysia) => {
  const { eventController } = new EventsModule()

  return app.use(authMiddleware).group('/events', (app) =>
    app
      .post(
        '/',
        (ctx) => eventController.create(ctx),
        {
          auth: true,
          body: t.Object({
            name: t.String({ minLength: 2, maxLength: 60 }),
            date: t.String(),
            time: t.String(),
            description: t.Optional(t.String({ maxLength: 300 })),
            participantIds: t.Array(t.String())
          }),
          detail: {
            tags: ['Events'],
            summary: 'Create an event',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .get(
        '/',
        (ctx) => eventController.list(ctx),
        {
          auth: true,
          detail: {
            tags: ['Events'],
            summary: 'List authenticated user events',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .get(
        '/invitations',
        (ctx) => eventController.listInvitations(ctx),
        {
          auth: true,
          detail: {
            tags: ['Events'],
            summary: 'List events the authenticated user was invited to',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .get(
        '/:id',
        (ctx) => eventController.getById(ctx),
        {
          auth: true,
          params: t.Object({ id: t.String() }),
          detail: {
            tags: ['Events'],
            summary: 'Get event by id',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .patch(
        '/:id',
        (ctx) => eventController.updateDescription(ctx),
        {
          auth: true,
          params: t.Object({ id: t.String() }),
          body: t.Object({
            description: t.String({ maxLength: 300 })
          }),
          detail: {
            tags: ['Events'],
            summary: 'Update event description',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .post(
        '/:id/respond',
        (ctx) => eventController.respondToInvitation(ctx),
        {
          auth: true,
          params: t.Object({ id: t.String() }),
          body: t.Object({
            status: t.Union([t.Literal('accepted'), t.Literal('declined')])
          }),
          detail: {
            tags: ['Events'],
            summary: 'Respond to an event invitation',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .delete(
        '/:id',
        (ctx) => eventController.delete(ctx),
        {
          auth: true,
          params: t.Object({ id: t.String() }),
          detail: {
            tags: ['Events'],
            summary: 'Delete an event',
            security: [{ cookieAuth: [] }]
          }
        }
      )
  )
}
