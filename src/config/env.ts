import { z } from 'zod'

export const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string(),
  EXPO_PUSH_ACCESS_TOKEN: z.string().optional(),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_REGION: z.string(),
  STORAGE_BUCKET: z.string(),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string(),
  STORAGE_PUBLIC_URL: z.string(),
  PLACE_REVIEW_COOLDOWN_MINUTES: z.coerce.number().positive().default(1),
  PLACE_REVIEW_MAX_DISTANCE_METERS: z.coerce.number().positive().default(2000)
})

export const env = envSchema.parse(Bun.env)
