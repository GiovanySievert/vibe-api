import { z } from 'zod'

const usernameRule = z
  .string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_\.]+$/i)

export const checkUsernameQuery = z.object({
  username: usernameRule
})

export const updateUsernameBody = z.object({
  username: usernameRule
})

export function parse<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input)
}
