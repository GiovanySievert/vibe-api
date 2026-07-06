import { beforeEach, describe, expect, it } from 'bun:test'

import { DeletePlaceReviewComment } from '../../application/use-cases/delete-place-review-comment'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('DeletePlaceReviewComment', () => {
  let deleteComment: DeletePlaceReviewComment
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    deleteComment = new DeletePlaceReviewComment(mockRepo)
  })

  it('should delete comment when requester is the comment author', async () => {
    const review = await mockRepo.create({
      userId: 'review-owner',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      isAnonymous: false,
      comment: null
    })

    const created = await mockRepo.createComment({
      reviewId: review.id,
      userId: 'comment-author',
      content: 'Nice spot'
    })

    await deleteComment.execute(created.id, review.id, 'comment-author')

    const found = await mockRepo.getCommentById(created.id)
    expect(found).toBeNull()
  })

  it('should delete comment when requester is the review owner', async () => {
    const review = await mockRepo.create({
      userId: 'review-owner',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      isAnonymous: false,
      comment: null
    })

    const created = await mockRepo.createComment({
      reviewId: review.id,
      userId: 'comment-author',
      content: 'Nice spot'
    })

    await deleteComment.execute(created.id, review.id, 'review-owner')

    const found = await mockRepo.getCommentById(created.id)
    expect(found).toBeNull()
  })

  it('should throw when comment does not exist', async () => {
    const review = await mockRepo.create({
      userId: 'review-owner',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      isAnonymous: false,
      comment: null
    })

    await expect(
      deleteComment.execute('non-existent-comment', review.id, 'review-owner')
    ).rejects.toThrow('Comment not found')
  })

  it('should throw when review does not exist', async () => {
    const review = await mockRepo.create({
      userId: 'review-owner',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      isAnonymous: false,
      comment: null
    })

    const created = await mockRepo.createComment({
      reviewId: review.id,
      userId: 'comment-author',
      content: 'Nice spot'
    })

    await expect(
      deleteComment.execute(created.id, 'non-existent-review', 'comment-author')
    ).rejects.toThrow('Review not found')
  })

  it('should throw when requester is neither comment author nor review owner', async () => {
    const review = await mockRepo.create({
      userId: 'review-owner',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      isAnonymous: false,
      comment: null
    })

    const created = await mockRepo.createComment({
      reviewId: review.id,
      userId: 'comment-author',
      content: 'Nice spot'
    })

    await expect(
      deleteComment.execute(created.id, review.id, 'unrelated-user')
    ).rejects.toThrow('Unauthorized')
  })
})
