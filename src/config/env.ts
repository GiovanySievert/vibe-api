import { z } from 'zod'

export const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string()
})

export const env = envSchema.parse(Bun.env)