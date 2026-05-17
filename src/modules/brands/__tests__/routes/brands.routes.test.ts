import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { brandsRoutes } from '../../infrastructure/http/routes/brands.routes'

describe('Brands Routes', () => {
  let app: Elysia

  const validBody = {
    brand: { name: 'Acme', taxId: '12345678', type: 'bar' },
    place: { name: 'Acme Place' },
    placeLocation: {
      addressLine: '123 Main',
      city: 'SP',
      state: 'SP',
      country: 'BR',
      neighborhood: 'Centro',
      postalCode: '01000-000',
      lat: -23.5,
      lng: -46.6
    },
    brandMenus: [
      { name: 'Beer', priceCents: 1500, description: 'Pint' }
    ]
  }

  beforeAll(() => {
    app = new Elysia().use(brandsRoutes)
  })

  describe('POST /brands', () => {
    it('returns 422 when body is empty', async () => {
      const response = await app.handle(
        new Request('http://localhost/brands/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
    })

    it('returns 422 when brand.name is too short', async () => {
      const response = await app.handle(
        new Request('http://localhost/brands/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validBody, brand: { ...validBody.brand, name: 'A' } })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/brand/name')
    })

    it('returns 422 when placeLocation.lat is out of range', async () => {
      const response = await app.handle(
        new Request('http://localhost/brands/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...validBody,
            placeLocation: { ...validBody.placeLocation, lat: 91 }
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/placeLocation/lat')
    })

    it('returns 422 when placeLocation.lng is out of range', async () => {
      const response = await app.handle(
        new Request('http://localhost/brands/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...validBody,
            placeLocation: { ...validBody.placeLocation, lng: -181 }
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/placeLocation/lng')
    })

    it('returns 422 when brandMenus priceCents is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/brands/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...validBody,
            brandMenus: [{ name: 'Beer', priceCents: 0, description: 'Pint' }]
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })

    it('returns 422 when brand is missing from body', async () => {
      const { brand, ...withoutBrand } = validBody
      const response = await app.handle(
        new Request('http://localhost/brands/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(withoutBrand)
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('places reindex routes', () => {
    it('requires authentication for starting reindex', async () => {
      const response = await app.handle(
        new Request('http://localhost/brands/places/reindex', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })

    it('requires authentication for checking reindex status', async () => {
      const response = await app.handle(new Request('http://localhost/brands/places/reindex/job-1'))

      expect(response.status).toBe(401)
    })
  })
})
