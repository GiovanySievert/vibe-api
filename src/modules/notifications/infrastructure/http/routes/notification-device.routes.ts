import { authMiddleware } from '@src/shared/middlewares'
import { Elysia, t } from 'elysia'
import { NotificationsModule } from '../../../notifications.module'

export const NotificationDeviceRoutes = (app: Elysia) => {
  const { notificationDeviceController } = new NotificationsModule()

  return app.use(authMiddleware).group('/notification-devices', (app) =>
    app
      .post(
        '/',
        (ctx) => notificationDeviceController.register(ctx),
        {
          auth: true,
          body: t.Object({
            token: t.String(),
            platform: t.String(),
            deviceId: t.Optional(t.String()),
            appBuild: t.Optional(t.String()),
            permissionStatus: t.String()
          }),
          detail: {
            tags: ['Notifications'],
            summary: 'Register a push notification device',
            security: [{ cookieAuth: [] }]
          }
        }
      )
      .delete(
        '/',
        (ctx) => notificationDeviceController.unregister(ctx),
        {
          auth: true,
          body: t.Object({
            token: t.String()
          }),
          detail: {
            tags: ['Notifications'],
            summary: 'Unregister a push notification device',
            security: [{ cookieAuth: [] }]
          }
        }
      )
  )
}
