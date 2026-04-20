import { Elysia, t } from 'elysia'

import { authMiddleware } from '@src/shared/middlewares'

import { EventCommentsModule } from '../../../event-comments.module'

export const EventCommentRoutes = (app: Elysia) => {
  const { eventCommentController } = new EventCommentsModule()

  return app.use(authMiddleware).group('/events/:eventId/comments', (app) =>
    app
      .get(
        '/',
        (ctx) => eventCommentController.list(ctx),
        {
          auth: true,
          params: t.Object({ eventId: t.String() }),
          query: t.Object({ page: t.Optional(t.String()) }),
          detail: {
            tags: ['Event Comments'],
            summary: 'List comments for an event',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .post(
        '/',
        (ctx) => eventCommentController.create(ctx),
        {
          auth: true,
          params: t.Object({ eventId: t.String() }),
          body: t.Object({ content: t.String({ minLength: 1, maxLength: 500 }) }),
          detail: {
            tags: ['Event Comments'],
            summary: 'Post a comment on an event',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .delete(
        '/:commentId',
        (ctx) => eventCommentController.delete(ctx),
        {
          auth: true,
          params: t.Object({ eventId: t.String(), commentId: t.String() }),
          detail: {
            tags: ['Event Comments'],
            summary: 'Delete a comment',
            security: [{ cookieAuth: [] }]
          }
        }
      )
  )
}
