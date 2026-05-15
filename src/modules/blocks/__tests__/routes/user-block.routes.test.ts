import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { UserBlockRoutes } from '../../infrastructure/http/routes/user-block.routes'

describe('User Block Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(UserBlockRoutes)
  })

  describe('POST /blocks/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/blocks/user-1', { method: 'POST' })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /blocks/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/blocks/user-1', { method: 'DELETE' })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /blocks/:userId/status', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/blocks/user-1/status')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /blocks', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/blocks/'))

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below 1', async () => {
      const response = await app.handle(new Request('http://localhost/blocks/?page=0'))

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })

    it('returns 422 when limit exceeds the maximum of 50', async () => {
      const response = await app.handle(new Request('http://localhost/blocks/?limit=999'))

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })
})
