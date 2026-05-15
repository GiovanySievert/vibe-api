import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { NotificationsRoutes } from '../../infrastructure/http/routes/notifications.routes'

describe('Notifications Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(NotificationsRoutes)
  })

  describe('GET /notifications', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/notifications'))

      expect(response.status).toBe(401)
    })
  })

  describe('GET /notifications/unread-count', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/unread-count')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('POST /notifications/:id/read', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/notif-1/read', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('POST /notifications/read-all', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/read-all', {
          method: 'POST'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /notifications/preferences', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/preferences')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /notifications/preferences/:type', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/preferences/follow', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pushEnabled: true, inAppEnabled: false })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when pushEnabled is not a boolean', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/preferences/follow', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pushEnabled: 'yes' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
      expect(data.property).toBe('/pushEnabled')
    })

    it('returns 422 when inAppEnabled is not a boolean', async () => {
      const response = await app.handle(
        new Request('http://localhost/notifications/preferences/follow', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ inAppEnabled: 1 })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/inAppEnabled')
    })
  })
})
