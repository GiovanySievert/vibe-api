import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { env } from '@src/config/env'

export const analyticsDb = drizzle(env.ANALYTICS_DATABASE_URL ?? env.DATABASE_URL, {
  schema,
  casing: 'snake_case'
})
