import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import 'dotenv/config'
import cors from '@elysiajs/cors'

import { auth } from '@src/config/auth'
import { OpenAPI } from './config/open-api'

const betterAuthPlugin = new Elysia({ name: 'better-auth' }).mount(auth.handler)

const app = new Elysia()
  .use(betterAuthPlugin)
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
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths()
      }
    })
  )
  .get('/', () => 'Hello VibeApi')
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
