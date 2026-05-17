import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { EventRoutes } from '../../infrastructure/http/routes/event.routes'

describe('Event Routes', () => {
  let app: Elysia

  const validCreateBody = {
    name: 'Birthday',
    date: '2026-06-01',
    time: '20:00',
    participantIds: []
  }

  beforeAll(() => {
    app = new Elysia().use(EventRoutes)
  })

  describe('POST /events', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(validCreateBody)
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when name is too short', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validCreateBody, name: 'A' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/name')
    })

    it('returns 422 when participantIds is missing', async () => {
      const { participantIds, ...withoutParticipants } = validCreateBody
      const response = await app.handle(
        new Request('http://localhost/events/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(withoutParticipants)
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/participantIds')
    })

    it('returns 422 when description exceeds 300 chars', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validCreateBody, description: 'x'.repeat(301) })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/description')
    })
  })

  describe('GET /events', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/events/'))

      expect(response.status).toBe(401)
    })
  })

  describe('GET /events/invitations', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/invitations')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /events/:id', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/events/event-1'))

      expect(response.status).toBe(401)
    })
  })

  describe('PATCH /events/:id', () => {
    const validPatchBody = {
      description: 'updated',
      placeId: null,
      imageUrl: null
    }

    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/event-1', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(validPatchBody)
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when description exceeds 300 chars', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/event-1', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validPatchBody, description: 'x'.repeat(301) })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/description')
    })

    it('returns 422 when placeId field is missing', async () => {
      const { placeId, ...withoutPlace } = validPatchBody
      const response = await app.handle(
        new Request('http://localhost/events/event-1', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(withoutPlace)
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('POST /events/:id/respond', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/event-1/respond', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ status: 'accepted' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when status is not in the allowed union', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/event-1/respond', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ status: 'maybe' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/status')
    })

    it('returns 422 when status is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/event-1/respond', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/status')
    })
  })

  describe('DELETE /events/:id', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/events/event-1', { method: 'DELETE' })
      )

      expect(response.status).toBe(401)
    })
  })
})
