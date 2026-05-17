import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { NotificationDeviceRoutes } from '../../infrastructure/http/routes/notification-device.routes'

describe('Notification Device Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(NotificationDeviceRoutes)
  })

  describe('POST /notification-devices', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            token: 'expo-token-xyz',
            platform: 'ios',
            permissionStatus: 'granted'
          })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when token is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            platform: 'ios',
            permissionStatus: 'granted'
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
      expect(data.property).toBe('/token')
    })

    it('returns 422 when platform is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            token: 'expo-token-xyz',
            permissionStatus: 'granted'
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/platform')
    })

    it('returns 422 when permissionStatus is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            token: 'expo-token-xyz',
            platform: 'ios'
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/permissionStatus')
    })

    it('returns 422 when token is not a string', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            token: 123,
            platform: 'ios',
            permissionStatus: 'granted'
          })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/token')
    })
  })

  describe('DELETE /notification-devices', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token: 'expo-token-xyz' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when token is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
      expect(data.property).toBe('/token')
    })

    it('returns 422 when token is not a string', async () => {
      const response = await app.handle(
        new Request('http://localhost/notification-devices', {
          method: 'DELETE',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token: false })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/token')
    })
  })
})
