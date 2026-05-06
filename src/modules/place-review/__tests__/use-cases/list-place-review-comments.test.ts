import { beforeEach, describe, expect, it } from 'bun:test'

import { ListPlaceReviewComments } from '../../application/use-cases'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('ListPlaceReviewComments', () => {
  let listPlaceReviewComments: ListPlaceReviewComments
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    listPlaceReviewComments = new ListPlaceReviewComments(mockRepo)
  })

  it('should list comments for a review', async () => {
    const review = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    await mockRepo.createComment({
      reviewId: review.id,
      userId: 'user-2',
      content: 'Esse lugar lota cedo?'
    })

    const result = await listPlaceReviewComments.execute({
      reviewId: review.id,
      page: 1,
      limit: 20
    })

    expect(result.total).toBe(1)
    expect(result.data[0]?.content).toBe('Esse lugar lota cedo?')
  })
})
