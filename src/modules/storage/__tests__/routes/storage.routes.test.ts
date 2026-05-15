import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { StorageRoutes } from '../../infrastructure/http/routes/storage.routes'

describe('Storage Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(StorageRoutes)
  })

  describe('POST /storage/upload-url', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/storage/upload-url', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contentType: 'image/png' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when contentType is not in the allowed image union', async () => {
      const response = await app.handle(
        new Request('http://localhost/storage/upload-url', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contentType: 'application/pdf' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
      expect(data.property).toBe('/contentType')
    })

    it('returns 422 when contentType is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/storage/upload-url', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/contentType')
    })

    it('returns 422 when folder violates length bounds', async () => {
      const response = await app.handle(
        new Request('http://localhost/storage/upload-url', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contentType: 'image/jpeg', folder: '' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })
})
