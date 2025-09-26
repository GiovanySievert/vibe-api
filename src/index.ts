import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import 'dotenv/config'

import { auth } from '@src/config/auth'
import { OpenAPI } from './config/open-api'

const app = new Elysia()
  .mount('/auth', auth.handler)
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
