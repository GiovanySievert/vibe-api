import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { NotificationsModule } from '../../../notifications.module'

export const NotificationsRoutes = (app: Elysia) => {
  const { notificationsController } = new NotificationsModule()

  return app.use(authMiddleware).group('/notifications', (app) =>
    app
      .get(
        '/',
        (ctx) => notificationsController.list(ctx),
        {
          auth: true,
          query: t.Object({
            limit: t.Optional(t.String()),
            cursor: t.Optional(t.String()),
            unreadOnly: t.Optional(t.String())
          }),
          detail: {
            tags: ['Notifications'],
            summary: 'List in-app notifications for the current user',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .get(
        '/unread-count',
        (ctx) => notificationsController.unreadCount(ctx),
        {
          auth: true,
          detail: {
            tags: ['Notifications'],
            summary: 'Get unread in-app notification count',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .post(
        '/:id/read',
        (ctx) => notificationsController.markAsRead(ctx),
        {
          auth: true,
          params: t.Object({ id: t.String() }),
          detail: {
            tags: ['Notifications'],
            summary: 'Mark a single notification as read',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .post(
        '/read-all',
        (ctx) => notificationsController.markAllAsRead(ctx),
        {
          auth: true,
          detail: {
            tags: ['Notifications'],
            summary: 'Mark all notifications as read',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .get(
        '/preferences',
        (ctx) => notificationsController.preferences(ctx),
        {
          auth: true,
          detail: {
            tags: ['Notifications'],
            summary: 'List notification channel preferences for the current user',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .put(
        '/preferences/:type',
        (ctx) => notificationsController.updatePreference(ctx),
        {
          auth: true,
          params: t.Object({ type: t.String() }),
          body: t.Object({
            pushEnabled: t.Optional(t.Boolean()),
            inAppEnabled: t.Optional(t.Boolean())
          }),
          detail: {
            tags: ['Notifications'],
            summary: 'Update notification channel preferences for a given type',
            security: [{ cookieAuth: [] }]
          }
        }
      )
  )
}
