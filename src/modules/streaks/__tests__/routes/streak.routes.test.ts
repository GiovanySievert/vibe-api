import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { StreakRoutes } from '../../infrastructure/http/routes/streak.routes'

describe('Streak Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(StreakRoutes)
  })

  describe('GET /streaks/me', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/streaks/me'))

      expect(response.status).toBe(401)
    })
  })

  describe('GET /streaks/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/streaks/user-1'))

      expect(response.status).toBe(401)
    })

    it('returns 401 when caller is not authenticated even for arbitrary ids', async () => {
      const response = await app.handle(
        new Request('http://localhost/streaks/another-user-id')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('Unknown method or path', () => {
    it('returns a non-success status for an undefined POST route', async () => {
      const response = await app.handle(
        new Request('http://localhost/streaks/me', { method: 'POST' })
      )

      expect(response.status).toBeGreaterThanOrEqual(400)
    })
  })
})
