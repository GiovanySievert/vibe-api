import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { userFavoritesPlacesRoutes } from '../../infrastructure/http/routes/user-favorites-places.routes'

describe('User Favorites Places Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(userFavoritesPlacesRoutes)
  })

  describe('GET /user-favorites-places', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-favorites-places/')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('POST /user-favorites-places/:placeId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-favorites-places/place-1', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /user-favorites-places/:placeId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-favorites-places/place-1', {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(401)
    })
  })
})
