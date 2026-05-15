import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { FollowRequestRoutes } from '../../infrastructure/http/routes/follow-request.routes'

describe('Follow Request Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(FollowRequestRoutes)
  })

  describe('GET /follow-requests', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/follow-requests'))

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests?page=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })

    it('returns 422 when limit exceeds the maximum', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests?limit=51')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('GET /follow-requests/requested', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests/requested')
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when limit is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests/requested?limit=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('POST /follow-requests/send/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests/send/user-1', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('POST /follow-requests/:requestFollowId/accept', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests/req-1/accept', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('POST /follow-requests/:requestFollowId/reject', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests/req-1/reject', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /follow-requests/:requestFollowId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-requests/req-1', {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(401)
    })
  })
})
