import { z } from 'zod'

export const validateUpdateBrandSchema = z.object({
  id: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_\.]+$/i)
})
