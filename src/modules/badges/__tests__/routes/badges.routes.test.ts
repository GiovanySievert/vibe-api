import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { BadgesRoutes } from '../../infrastructure/http/routes/badges.routes'

describe('Badges Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(BadgesRoutes)
  })

  describe('GET /badges/me', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/badges/me'))

      expect(response.status).toBe(401)
    })
  })

  describe('GET /badges/me/progress', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/badges/me/progress'))

      expect(response.status).toBe(401)
    })
  })

  describe('GET /badges/user/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/badges/user/user-1'))

      expect(response.status).toBe(401)
    })
  })

  describe('GET /badges/user/:userId/place/:placeId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/badges/user/user-1/place/place-1')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /badges/me/profile-selection', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/badges/me/profile-selection', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ placeIds: ['place-1'] })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when placeIds is not an array', async () => {
      const response = await app.handle(
        new Request('http://localhost/badges/me/profile-selection', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ placeIds: 'place-1' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/placeIds')
    })

    it('returns 422 when placeIds is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/badges/me/profile-selection', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })
})
