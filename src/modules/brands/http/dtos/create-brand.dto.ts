import { t, type Static } from 'elysia'

export const validateCreateBrandSchema = t.Object({
  name: t.String({ minLength: 3, maxLength: 20 }),
  taxId: t.String({ minLength: 3, maxLength: 20 }),
  type: t.String({ minLength: 3, maxLength: 20 })
})

export const validateCreateVenueSchema = t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
  priceRange: t.Optional(t.Nullable(t.String({ maxLength: 5 }))),
  paymentMethods: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  socialInstagram: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  socialTiktok: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  contactPhone: t.Optional(t.Nullable(t.String({ maxLength: 50 }))),
  about: t.Optional(t.Nullable(t.String()))
})

export const validateCreateVenueLocationSchema = t.Object({
  addressLine: t.String({ minLength: 1, maxLength: 255 }),
  addressLine2: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  number: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
  city: t.String({ minLength: 1, maxLength: 255 }),
  state: t.String({ minLength: 1, maxLength: 255 }),
  country: t.String({ minLength: 1, maxLength: 255 }),
  neighborhood: t.String({ minLength: 1, maxLength: 255 }),
  postalCode: t.String({ minLength: 1, maxLength: 255 }),
  lat: t.String({ minimum: -90, maximum: 90 }),
  lng: t.String({ minimum: -180, maximum: 180 })
})

export const validateBrandMenusSchema = t.Array(
  t.Object({
    name: t.String({ minLength: 1, maxLength: 255 }),
    priceCents: t.Number({ minimum: 1, maximum: 100000 }),
    description: t.String({
      minLength: 1,
      maxLength: 255
    })
  })
)

export const validateCreateAllEntities = t.Object({
  brand: validateCreateBrandSchema,
  venue: validateCreateVenueSchema,
  venueLocation: validateCreateVenueLocationSchema,
  brandMenus: validateBrandMenusSchema
})

export type CreateBrandDTO = Static<typeof validateCreateBrandSchema>
export type CreateVenueDTO = Static<typeof validateCreateVenueSchema>
export type CreateVenueLocationDTO = Static<typeof validateCreateVenueLocationSchema>
export type CreateAllEntitiesDTO = Static<typeof validateCreateAllEntities>
