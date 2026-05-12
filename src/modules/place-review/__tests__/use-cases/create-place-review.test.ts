import { describe, it, expect, beforeEach } from 'bun:test'

import { CreatePlaceReview } from '../../application/use-cases/create-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { EvaluateUserPlaceBadge } from '@src/modules/badges/application/use-cases'
import { PlaceReviewCooldownException, PlaceReviewOutOfRangeException } from '../../domain/exceptions'

class NoopProducer {
  async publish(): Promise<void> {}
}

class NoopWeeklyActivity {
  async execute(): Promise<void> {}
}

class NoopEvaluateBadge {
  async execute(): Promise<void> {}
}

const PLACE_COORDS = { lat: -30.0277, lng: -51.205 }
const NEARBY_USER_COORDS = { lat: -30.0277, lng: -51.205 }
const FAR_USER_COORDS = { lat: -30.05, lng: -51.25 }

const baseInput = {
  userId: 'user-1',
  placeId: 'place-1',
  placeName: 'place-1',
  rating: 'crowded' as const,
  placeImageUrl: 'http://example.com/place.jpg',
  selfieUrl: null,
  selfieFriendsOnly: false,
  comment: null,
  userLat: NEARBY_USER_COORDS.lat,
  userLng: NEARBY_USER_COORDS.lng,
  placeLat: PLACE_COORDS.lat,
  placeLng: PLACE_COORDS.lng
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
      new NoopEvaluateBadge() as unknown as EvaluateUserPlaceBadge,
      { cooldownMinutes: 60, maxDistanceMeters: 500 }
    )
  })

  it('creates a review when within range and no previous review', async () => {
    const result = await createPlaceReview.execute(baseInput)

    expect(result.id).toBeDefined()
    expect(result.userId).toBe('user-1')
    expect(result.placeImageUrl).toBe('http://example.com/place.jpg')
    expect(mockRepo.getAll()).toHaveLength(1)
  })

  it('throws PlaceReviewOutOfRangeException when user is more than maxDistanceMeters away', async () => {
    const promise = createPlaceReview.execute({
      ...baseInput,
      userLat: FAR_USER_COORDS.lat,
      userLng: FAR_USER_COORDS.lng
    })

    await expect(promise).rejects.toBeInstanceOf(PlaceReviewOutOfRangeException)
  })

  it('throws PlaceReviewCooldownException when a review exists within cooldown window', async () => {
    mockRepo.seed([
      {
        id: 'previous-review',
        userId: 'user-1',
        placeId: 'place-1',
        placeName: 'place-1',
        rating: 'crowded',
        placeImageUrl: 'http://example.com/place.jpg',
        selfieUrl: null,
        selfieFriendsOnly: false,
        comment: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ])

    try {
      await createPlaceReview.execute(baseInput)
      throw new Error('expected to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(PlaceReviewCooldownException)
      const cooldownError = error as PlaceReviewCooldownException
      const expectedNextAllowedAt = Date.now() + 30 * 60 * 1000
      expect(Math.abs(cooldownError.nextAllowedAt.getTime() - expectedNextAllowedAt)).toBeLessThan(2000)
      expect(cooldownError.cooldownMinutes).toBe(60)
    }
  })

  it('creates the review when previous review is past the cooldown window', async () => {
    mockRepo.seed([
      {
        id: 'previous-review',
        userId: 'user-1',
        placeId: 'place-1',
        placeName: 'place-1',
        rating: 'crowded',
        placeImageUrl: 'http://example.com/place.jpg',
        selfieUrl: null,
        selfieFriendsOnly: false,
        comment: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ])

    const result = await createPlaceReview.execute(baseInput)
    expect(result.id).toBeDefined()
    expect(mockRepo.getAll()).toHaveLength(2)
  })

  it('does not persist userLat/userLng/placeLat/placeLng on the review row', async () => {
    const result = await createPlaceReview.execute(baseInput)
    const persisted = result as unknown as Record<string, unknown>
    expect(persisted.userLat).toBeUndefined()
    expect(persisted.userLng).toBeUndefined()
    expect(persisted.placeLat).toBeUndefined()
    expect(persisted.placeLng).toBeUndefined()
  })
})
