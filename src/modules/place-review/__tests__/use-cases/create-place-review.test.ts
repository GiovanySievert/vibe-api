import { describe, it, expect, beforeEach } from 'bun:test'

import { CreatePlaceReview } from '../../application/use-cases/create-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('CreatePlaceReview', () => {
  let createPlaceReview: CreatePlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    createPlaceReview = new CreatePlaceReview(mockRepo)
  })

  it('should create a review with crowded rating and imageUrl', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-1',
      rating: 'crowded',
      imageUrl: 'http://example.com/photo.jpg',
      comment: null
    })

    expect(result.id).toBeDefined()
    expect(result.userId).toBe('user-1')
    expect(result.placeId).toBe('place-1')
    expect(result.rating).toBe('crowded')
    expect(result.imageUrl).toBe('http://example.com/photo.jpg')
    expect(result.comment).toBeNull()
  })

  it('should create a review with dead rating and optional comment', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-2',
      placeId: 'place-1',
      rating: 'dead',
      imageUrl: null,
      comment: 'Tava bem vazio essa noite'
    })

    expect(result.rating).toBe('dead')
    expect(result.comment).toBe('Tava bem vazio essa noite')
    expect(result.imageUrl).toBeNull()
  })

  it('should create a review without imageUrl or comment', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-2',
      rating: 'crowded',
      imageUrl: null,
      comment: null
    })

    expect(result.imageUrl).toBeNull()
    expect(result.comment).toBeNull()
  })

  it('should persist the review in the repository', async () => {
    await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-1',
      rating: 'crowded',
      imageUrl: null,
      comment: null
    })

    expect(mockRepo.getAll()).toHaveLength(1)
  })
})
