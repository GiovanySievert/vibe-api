import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { placesRoutes } from '../../infrastructure/http/routes/places.routes'

describe('Places Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(placesRoutes)
  })

  describe('GET /places/:placeId', () => {
    it('returns 404 when method is not supported', async () => {
      const response = await app.handle(
        new Request('http://localhost/places/place-1', { method: 'POST' })
      )

      expect(response.status).toBe(404)
    })

    it('returns 404 when no placeId path segment is provided', async () => {
      const response = await app.handle(new Request('http://localhost/places/'))

      expect(response.status).toBe(404)
    })
  })
})
