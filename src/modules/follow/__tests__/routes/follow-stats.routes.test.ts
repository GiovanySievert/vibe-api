import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { FollowStatsRoutes } from '../../infrastructure/http/routes/follow-stats.routes'

describe('Follow Stats Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(FollowStatsRoutes)
  })

  describe('GET /follow-stats/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/follow-stats/user-1')
      )

      expect(response.status).toBe(401)
    })

    it('returns 404 when userId param is missing', async () => {
      const response = await app.handle(new Request('http://localhost/follow-stats/'))

      expect(response.status).toBe(404)
    })
  })
})
