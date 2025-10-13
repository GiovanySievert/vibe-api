import { z } from 'zod'
export const checkUsernameQuery = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_\.]+$/i)
})
export function parse<T>(schema: z.ZodSchema<T>, input: unknown): T {
  return schema.parse(input)
}
