import { beforeEach, describe, expect, it } from 'bun:test'

import { CreatePlaceReviewComment } from '../../application/use-cases'
import { PlaceReviewNotFoundException } from '../../domain/exceptions'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('CreatePlaceReviewComment', () => {
  let createPlaceReviewComment: CreatePlaceReviewComment
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    createPlaceReviewComment = new CreatePlaceReviewComment(mockRepo)
  })

  it('should create a comment for an existing review', async () => {
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

    const result = await createPlaceReviewComment.execute({
      reviewId: review.id,
      userId: 'user-2',
      content: 'Partiu nesse horario?'
    })

    expect(result.reviewId).toBe(review.id)
    expect(result.content).toBe('Partiu nesse horario?')
    expect(result.userId).toBe('user-2')
  })

  it('should throw when the review does not exist', async () => {
    await expect(
      createPlaceReviewComment.execute({
        reviewId: 'missing-review',
        userId: 'user-2',
        content: 'Teste'
      })
    ).rejects.toBeInstanceOf(PlaceReviewNotFoundException)
  })
})
