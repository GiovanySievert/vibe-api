import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  TRUSTED_ORIGINS: z
    .string()
    .default('myapp://')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
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
  PLACE_REVIEW_MAX_DISTANCE_METERS: z.coerce.number().positive().default(2000),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  APPLE_APP_BUNDLE_ID: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional()
})

export const env = envSchema.parse(Bun.env)
