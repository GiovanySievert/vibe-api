import { t, type Static } from 'elysia'

export const validateCreateFavoritesPlaces = t.Object({
  placeId: t.String({ minLength: 3, maxLength: 20 })
})

export type CreateBrandDTO = Static<typeof validateCreateFavoritesPlaces>
