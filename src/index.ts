import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'

import { auth } from '@src/config/auth'
import { OpenAPI } from './config/open-api'
import { authRoutes } from './modules/auth/infrastructure/http/routes/auth.routes'
import { brandsRoutes } from './modules/brands/infrastructure/http/routes'
import { errorHandler } from './shared/infra/http/plugins/error-handler'
import { helmetPlugin } from './shared/infra/http/plugins/helmet'
import { placesRoutes } from './modules/brands/infrastructure/http/routes/places.routes'
import { userFavoritesPlacesRoutes } from './modules/user-favorites-places/infrastructure/http/routes'
import { FollowerRoutes, FollowRequestRoutes, FollowStatsRoutes } from './modules/follow/infrastructure/http/routes'
import { PublicUsersRoute } from './modules/users/infrastructure/http/routes'
import { healthRoutes } from './modules/health/infrastructure/http/routes/health.routes'
import { UserBlockRoutes } from './modules/blocks/infrastructure/http/routes'
import { EventRoutes } from './modules/events/infrastructure/http/routes'
import { EventCommentRoutes } from './modules/event-comments/infrastructure/http/routes'
import { PlaceReviewRoutes } from './modules/place-review/infrastructure/http/routes'
import { appLogger } from './config/logger'
import { loggingMiddleware } from './shared/middlewares/logging.middleware'
import { NotificationDeviceRoutes } from './modules/notifications/infrastructure/http/routes/notification-device.routes'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { applicationEventBus } from './shared/application/events'
import { rabbitMQConnection } from './shared/infra/messaging/rabbitmq-connection'

const betterAuthPlugin = new Elysia({ name: 'better-auth' }).mount(auth.handler)
const notificationsModule = new NotificationsModule()

notificationsModule.registerEventHandlers(applicationEventBus)

const app = new Elysia()
  .use(helmetPlugin)
  .use(errorHandler)
  .use(loggingMiddleware)
  .use(betterAuthPlugin)
  .use(healthRoutes)
  .use(authRoutes)
  .use(brandsRoutes)
  .use(placesRoutes)
  .use(userFavoritesPlacesRoutes)
  .use(PublicUsersRoute)
  .use(FollowerRoutes)
  .use(FollowRequestRoutes)
  .use(FollowStatsRoutes)
  .use(UserBlockRoutes)
  .use(EventRoutes)
  .use(EventCommentRoutes)
  .use(PlaceReviewRoutes)
  .use(NotificationDeviceRoutes)
  .use(
    cors({
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )
  .use(
    openapi({
      documentation: {
        components: {
          ...(await OpenAPI.components),
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'better-auth.session_token'
            }
          }
        },
        paths: await OpenAPI.getPaths()
      }
    })
  )
  .listen(3000)

appLogger.info('Vibe-api is running', {
  hostname: app.server?.hostname,
  port: app.server?.port,
  environment: process.env.NODE_ENV || 'development'
})

const shutdown = async (signal: string) => {
  appLogger.info('shutting down', { signal })
  try {
    await app.stop()
    await rabbitMQConnection.close()
    process.exit(0)
  } catch (err) {
    appLogger.error('error during shutdown', { err })
    process.exit(1)
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
