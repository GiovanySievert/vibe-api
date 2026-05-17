import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { UserProfileRoutes } from '../../infrastructure/http/routes/user-profile.routes'

describe('User Profile Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(UserProfileRoutes)
  })

  describe('PATCH /user-profile', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-profile/', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: 'Alice' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when name is empty', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-profile/', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: '' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/name')
    })

    it('returns 422 when name exceeds 100 chars', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-profile/', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: 'x'.repeat(101) })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/name')
    })

    it('returns 422 when bio exceeds 300 chars', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-profile/', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: 'Alice', bio: 'x'.repeat(301) })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/bio')
    })

    it('returns 422 when name is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/user-profile/', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/name')
    })
  })
})
