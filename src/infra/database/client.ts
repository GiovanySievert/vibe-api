import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { env } from '@src/config/env'

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: 'snake_case'
})
