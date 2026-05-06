import { describe, it, expect, beforeEach } from 'bun:test'

import { GetPlaceReviewCounts } from '../../application/use-cases/get-place-review-counts'
import { SetPlaceReviewReaction } from '../../application/use-cases/set-place-review-reaction'
import { CreatePlaceReviewComment } from '../../application/use-cases/create-place-review-comment'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('GetPlaceReviewCounts', () => {
  let getPlaceReviewCounts: GetPlaceReviewCounts
  let setReaction: SetPlaceReviewReaction
  let createComment: CreatePlaceReviewComment
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    getPlaceReviewCounts = new GetPlaceReviewCounts(mockRepo)
    setReaction = new SetPlaceReviewReaction(mockRepo)
    createComment = new CreatePlaceReviewComment(mockRepo)
  })

  it('should return zero counts for a review with no interactions', async () => {
    const review = await mockRepo.create({
      userId: 'user-1', placeId: 'place-1', placeName: 'Place 1',
      rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null
    })

    const [counts] = await getPlaceReviewCounts.execute([review.id])

    expect(counts.commentsCount).toBe(0)
    expect(counts.onCount).toBe(0)
    expect(counts.offCount).toBe(0)
  })

  it('should count comments correctly', async () => {
    const review = await mockRepo.create({
      userId: 'user-1', placeId: 'place-1', placeName: 'Place 1',
      rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null
    })

    await createComment.execute({ reviewId: review.id, userId: 'user-2', content: 'nice!' })
    await createComment.execute({ reviewId: review.id, userId: 'user-3', content: 'agreed' })

    const [counts] = await getPlaceReviewCounts.execute([review.id])

    expect(counts.commentsCount).toBe(2)
  })

  it('should count on and off reactions separately', async () => {
    const review = await mockRepo.create({
      userId: 'user-1', placeId: 'place-1', placeName: 'Place 1',
      rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null
    })

    await setReaction.execute({ reviewId: review.id, userId: 'user-2', type: 'on' })
    await setReaction.execute({ reviewId: review.id, userId: 'user-3', type: 'on' })
    await setReaction.execute({ reviewId: review.id, userId: 'user-4', type: 'off' })

    const [counts] = await getPlaceReviewCounts.execute([review.id])

    expect(counts.onCount).toBe(2)
    expect(counts.offCount).toBe(1)
  })

  it('should return counts for multiple reviews in one call', async () => {
    const r1 = await mockRepo.create({
      userId: 'user-1', placeId: 'place-1', placeName: 'Place 1',
      rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null
    })
    const r2 = await mockRepo.create({
      userId: 'user-1', placeId: 'place-1', placeName: 'Place 1',
      rating: 'dead', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null
    })

    await setReaction.execute({ reviewId: r1.id, userId: 'user-2', type: 'on' })
    await createComment.execute({ reviewId: r2.id, userId: 'user-2', content: 'cool' })

    const counts = await getPlaceReviewCounts.execute([r1.id, r2.id])
    const countById = new Map(counts.map((c) => [c.reviewId, c]))

    expect(countById.get(r1.id)?.onCount).toBe(1)
    expect(countById.get(r1.id)?.commentsCount).toBe(0)
    expect(countById.get(r2.id)?.commentsCount).toBe(1)
    expect(countById.get(r2.id)?.onCount).toBe(0)
  })

  it('should return default zero counts for unknown reviewId', async () => {
    const [counts] = await getPlaceReviewCounts.execute(['non-existent-id'])

    expect(counts.reviewId).toBe('non-existent-id')
    expect(counts.commentsCount).toBe(0)
    expect(counts.onCount).toBe(0)
    expect(counts.offCount).toBe(0)
  })
})
