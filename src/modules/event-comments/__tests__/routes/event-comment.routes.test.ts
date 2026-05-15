import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { EventCommentRoutes } from '../../infrastructure/http/routes/event-comment.routes'

describe('Event Comment Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(EventCommentRoutes)
  })

  describe('GET /events/:id/comments', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/evt-1/comments/')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('POST /events/:id/comments', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/evt-1/comments/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: 'looks fun' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when content is empty', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/evt-1/comments/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: '' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/content')
    })

    it('returns 422 when content exceeds 500 characters', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/evt-1/comments/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: 'x'.repeat(501) })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })

    it('returns 422 when content field is missing', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/evt-1/comments/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('DELETE /events/:id/comments/:commentId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/evt-1/comments/comment-1', { method: 'DELETE' })
      )

      expect(response.status).toBe(401)
    })
  })
})
