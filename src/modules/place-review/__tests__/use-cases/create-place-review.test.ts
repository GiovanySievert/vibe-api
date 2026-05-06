import { describe, it, expect, beforeEach } from 'bun:test'

import { CreatePlaceReview } from '../../application/use-cases/create-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { EvaluateUserPlaceBadge } from '@src/modules/badges/application/use-cases'

class NoopProducer {
  async publish(): Promise<void> {}
}

class NoopWeeklyActivity {
  async execute(): Promise<void> {}
}

class NoopEvaluateBadge {
  async execute(): Promise<void> {}
}

describe('CreatePlaceReview', () => {
  let createPlaceReview: CreatePlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    createPlaceReview = new CreatePlaceReview(
      mockRepo,
      new NoopProducer() as unknown as RabbitMQProducer,
      new NoopWeeklyActivity() as never,
      new NoopEvaluateBadge() as unknown as EvaluateUserPlaceBadge
    )
  })

  it('should create a review with crowded rating and placeImageUrl', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: 'http://example.com/place.jpg',
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    expect(result.id).toBeDefined()
    expect(result.userId).toBe('user-1')
    expect(result.placeId).toBe('place-1')
    expect(result.rating).toBe('crowded')
    expect(result.placeImageUrl).toBe('http://example.com/place.jpg')
    expect(result.selfieUrl).toBeNull()
    expect(result.comment).toBeNull()
  })

  it('should create a review with both placeImageUrl and selfieUrl', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: 'http://example.com/place.jpg',
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieFriendsOnly: true,
      comment: null
    })

    expect(result.placeImageUrl).toBe('http://example.com/place.jpg')
    expect(result.selfieUrl).toBe('http://example.com/selfie.jpg')
    expect(result.selfieFriendsOnly).toBe(true)
  })

  it('should create a review with dead rating and optional comment', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-2',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'dead',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: 'Tava bem vazio essa noite'
    })

    expect(result.rating).toBe('dead')
    expect(result.comment).toBe('Tava bem vazio essa noite')
    expect(result.placeImageUrl).toBeNull()
    expect(result.selfieUrl).toBeNull()
  })

  it('should create a review without placeImageUrl, selfieUrl, or comment', async () => {
    const result = await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-2',
      placeName: 'place-2',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    expect(result.placeImageUrl).toBeNull()
    expect(result.selfieUrl).toBeNull()
    expect(result.comment).toBeNull()
  })

  it('should persist the review in the repository', async () => {
    await createPlaceReview.execute({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    expect(mockRepo.getAll()).toHaveLength(1)
  })
})
