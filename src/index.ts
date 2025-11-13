import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import 'dotenv/config'
import cors from '@elysiajs/cors'

import { auth } from '@src/config/auth'
import { OpenAPI } from './config/open-api'
import { authRoutes } from './modules/auth/interface/http/routes/auth.routes'
import { brandsRoutes } from './modules/brands/http/routes'
import { errorHandler } from './shared/infra/http/plugins/error-handler'
import { venuesRoutes } from './modules/brands/http/routes/venues.routes'
import { userFavoritesPlacesRoutes } from './modules/user-favorites-places/http/routes'
import { FollowRoutes } from './modules/follow/http/routes'

const betterAuthPlugin = new Elysia({ name: 'better-auth' }).mount(auth.handler)

const app = new Elysia()
  .use(errorHandler)
  .use(betterAuthPlugin)
  .use(authRoutes)
  .use(brandsRoutes)
  .use(venuesRoutes)
  .use(userFavoritesPlacesRoutes)
  .use(FollowRoutes)
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

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
