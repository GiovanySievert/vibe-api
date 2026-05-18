import { beforeAll, describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { PlaceReviewRoutes } from '../../infrastructure/http/routes/place-review.route'

describe('Place Review Routes', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(PlaceReviewRoutes)
  })

  describe('GET /place-reviews/feed', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(new Request('http://localhost/place-reviews/feed'))

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/feed?page=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('POST /place-reviews', () => {
    const validBody = {
      placeId: 'place-1',
      placeName: 'Some Bar',
      rating: 'crowded',
      placeImageUrl: 'https://cdn/p.jpg',
      userLat: -23.5,
      userLng: -46.6,
      placeLat: -23.5,
      placeLng: -46.6
    }

    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(validBody)
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when rating is not in the allowed union', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validBody, rating: 'busy' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.on).toBe('body')
      expect(data.property).toBe('/rating')
    })

    it('returns 422 when placeName is an empty string', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validBody, placeName: '' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/placeName')
    })

    it('returns 422 when userLat is out of range', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validBody, userLat: 91 })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/userLat')
    })

    it('returns 422 when placeLng is out of range', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...validBody, placeLng: -181 })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/placeLng')
    })

    it('returns 422 when placeId is missing from the body', async () => {
      const { placeId, ...withoutId } = validBody
      const response = await app.handle(
        new Request('http://localhost/place-reviews', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(withoutId)
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/placeId')
    })
  })

  describe('GET /place-reviews/place/:placeId/eligibility', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1/eligibility')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /place-reviews/place/:placeId/friends', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1/friends')
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1/friends?page=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })

    it('returns 422 when limit is above the maximum', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1/friends?limit=21')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('GET /place-reviews/:reviewId/interactions/count', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/interactions/count')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /place-reviews/:reviewId/interactions', () => {
    it('returns 401 when caller is not authenticated with a valid query', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/interactions?type=on')
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when type is missing from query', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/interactions')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })

    it('returns 422 when type is not in the allowed union', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/interactions?type=maybe')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('GET /place-reviews/:reviewId/counts', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/counts')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /place-reviews/:reviewId/favorite', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/favorite', {
          method: 'PUT'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('DELETE /place-reviews/:reviewId/favorite', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/favorite', {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /place-reviews/:reviewId/comments', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/comments')
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/comments?page=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('POST /place-reviews/:reviewId/comments', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/comments', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: 'nice spot' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when content is empty', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/comments', {
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

    it('returns 422 when content exceeds 500 chars', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/comments', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: 'x'.repeat(501) })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/content')
    })
  })

  describe('DELETE /place-reviews/:reviewId/comments/:commentId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/comments/comment-1', {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /place-reviews/:reviewId/reaction', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/reaction', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'on' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when type is not in the allowed union', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/reaction', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ type: 'maybe' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/type')
    })

    it('returns 422 when type is missing from the body', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/reaction', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({})
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/type')
    })
  })

  describe('DELETE /place-reviews/:reviewId/reaction', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1/reaction', {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /place-reviews/:reviewId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /place-reviews/place/:placeId/popular', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1/popular')
      )

      expect(response.status).toBe(401)
    })
  })

  describe('GET /place-reviews/place/:placeId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1')
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/place/place-1?page=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('GET /place-reviews/user/:userId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/user/user-1')
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when page is below the minimum', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/user/user-1?page=0')
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
    })
  })

  describe('PATCH /place-reviews/:reviewId', () => {
    it('returns 401 when caller is not authenticated with a valid body', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ rating: 'dead' })
        })
      )

      expect(response.status).toBe(401)
    })

    it('returns 422 when rating is not in the allowed union', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ rating: 'busy' })
        })
      )

      expect(response.status).toBe(422)
      const data = await response.json()
      expect(data.type).toBe('validation')
      expect(data.property).toBe('/rating')
    })
  })

  describe('DELETE /place-reviews/:reviewId', () => {
    it('returns 401 when caller is not authenticated', async () => {
      const response = await app.handle(
        new Request('http://localhost/place-reviews/review-1', {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(401)
    })
  })
})
