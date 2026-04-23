import { describe, it, expect, beforeEach } from 'bun:test'

import { GetPlaceReview } from '../../application/use-cases/get-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('GetPlaceReview', () => {
  let getPlaceReview: GetPlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    getPlaceReview = new GetPlaceReview(mockRepo)
  })

  it('should return a review by id', async () => {
    const created = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      rating: 'crowded',
      imageUrl: 'http://example.com/photo.jpg',
      comment: null
    })

    const result = await getPlaceReview.execute(created.id)

    expect(result).not.toBeNull()
    expect(result!.id).toBe(created.id)
    expect(result!.rating).toBe('crowded')
  })

  it('should return null when review does not exist', async () => {
    const result = await getPlaceReview.execute('id-inexistente')

    expect(result).toBeNull()
  })
})
