import { z } from 'zod'

export const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DATABASE_URL: z.string()
})

export const env = envSchema.parse(Bun.env)
