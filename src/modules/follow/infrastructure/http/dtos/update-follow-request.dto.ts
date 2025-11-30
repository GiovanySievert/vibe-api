import { t, type Static } from 'elysia'

export const validateUpdateFollowRequest = t.Object({
  status: t.String({ minLength: 3, maxLength: 20 })
})

export type UpdateFollowRequestDto = Static<typeof validateUpdateFollowRequest>
