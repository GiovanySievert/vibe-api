import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { AuthModule } from '../../auth.module'
import { createAuthRoutes } from '../../infrastructure/http/routes/auth.routes'
import { MockUserRepository } from '../mocks/user.repository.mock'

describe('Auth Routes', () => {
  let app: Elysia

  beforeAll(() => {
    const module = new AuthModule(new MockUserRepository())
    app = new Elysia().use(createAuthRoutes(module))
  })

  describe('GET /auth/check-username', () => {
    it('returns 200 and availability payload when query is valid', async () => {
      const response = await app.handle(
        new Request(`http://localhost/auth/check-username?username=avail_${Date.now()}`)
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('available')
      expect(typeof data.available).toBe('boolean')
    })

    it('returns 422 when username query param is missing', async () => {
      const response = await app.handle(new Request('http://localhost/auth/check-username'))

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('PATCH /auth/username', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/username', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ username: 'someone' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when body username is too short', async () => {
      const response = await app.handle(
        new Request('http://localhost/auth/username', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ username: 'ab' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
    })
  })
})
