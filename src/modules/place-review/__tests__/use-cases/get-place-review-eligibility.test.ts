import { describe, it, expect, beforeEach } from 'bun:test'

import { GetPlaceReviewEligibility } from '../../application/use-cases/get-place-review-eligibility'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('GetPlaceReviewEligibility', () => {
  let useCase: GetPlaceReviewEligibility
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    useCase = new GetPlaceReviewEligibility(mockRepo, { cooldownMinutes: 60 })
  })

  it('returns canReview=true and reason=null when no previous review', async () => {
    const result = await useCase.execute({ userId: 'user-1', placeId: 'place-1' })

    expect(result.canReview).toBe(true)
    expect(result.reason).toBeNull()
    expect(result.cooldown.active).toBe(false)
    expect(result.cooldown.lastReviewAt).toBeNull()
    expect(result.cooldown.nextAllowedAt).toBeNull()
  })

  it('returns canReview=false with reason cooldown when last review is within cooldown window', async () => {
    const lastReviewAt = new Date(Date.now() - 30 * 60 * 1000)
    mockRepo.seed([
      {
        id: 'r1',
        userId: 'user-1',
        placeId: 'place-1',
        placeName: 'place-1',
        rating: 'crowded',
        placeImageUrl: 'http://example.com/place.jpg',
        selfieUrl: null,
        isAnonymous: false,
        comment: null,
        createdAt: lastReviewAt,
        updatedAt: lastReviewAt
      }
    ])

    const result = await useCase.execute({ userId: 'user-1', placeId: 'place-1' })

    expect(result.canReview).toBe(false)
    expect(result.reason).toBe('cooldown')
    expect(result.cooldown.active).toBe(true)
    expect(result.cooldown.lastReviewAt).toBe(lastReviewAt.toISOString())
    expect(result.cooldown.nextAllowedAt).not.toBeNull()
    const expectedNext = lastReviewAt.getTime() + 60 * 60 * 1000
    expect(new Date(result.cooldown.nextAllowedAt as string).getTime()).toBe(expectedNext)
  })

  it('returns canReview=true when previous review is past cooldown window', async () => {
    mockRepo.seed([
      {
        id: 'r1',
        userId: 'user-1',
        placeId: 'place-1',
        placeName: 'place-1',
        rating: 'crowded',
        placeImageUrl: 'http://example.com/place.jpg',
        selfieUrl: null,
        isAnonymous: false,
        comment: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ])

    const result = await useCase.execute({ userId: 'user-1', placeId: 'place-1' })

    expect(result.canReview).toBe(true)
    expect(result.reason).toBeNull()
    expect(result.cooldown.active).toBe(false)
    expect(result.cooldown.lastReviewAt).not.toBeNull()
  })
})
