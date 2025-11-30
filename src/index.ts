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
import { FollowerRoutes, FollowRoutes } from './modules/follow/infrastructure/http/routes'
import { PublicUsersRoute } from './modules/users/infrastructure/http/routes'
import { healthRoutes } from './modules/health/infrastructure/http/routes/health.routes'
import { appLogger } from './config/logger'
import { loggingMiddleware } from './shared/middlewares/logging.middleware'

const betterAuthPlugin = new Elysia({ name: 'better-auth' }).mount(auth.handler)

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
  .use(FollowRoutes)
  .use(FollowerRoutes)
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
