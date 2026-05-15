import { z } from 'zod'

export const PlaceIndexedPayloadSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().nullable(),
  neighborhood: z.string().nullable(),
  location: z.object({
    lat: z.number(),
    lon: z.number()
  })
})
