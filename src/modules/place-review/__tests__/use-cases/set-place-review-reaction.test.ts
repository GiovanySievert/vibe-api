import { beforeEach, describe, expect, it } from 'bun:test'

import { ListFollowingFeed, RemovePlaceReviewReaction, SetPlaceReviewReaction } from '../../application/use-cases'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'
import { MockFollowChecker } from '../mocks/follow-checker.mock'

describe('SetPlaceReviewReaction', () => {
  let listFollowingFeed: ListFollowingFeed
  let setPlaceReviewReaction: SetPlaceReviewReaction
  let removePlaceReviewReaction: RemovePlaceReviewReaction
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    listFollowingFeed = new ListFollowingFeed(mockRepo, new MockFollowChecker())
    setPlaceReviewReaction = new SetPlaceReviewReaction(mockRepo)
    removePlaceReviewReaction = new RemovePlaceReviewReaction(mockRepo)
  })

  it('should set and update a user reaction in feed aggregates', async () => {
    const review = await mockRepo.create({
      userId: 'author-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    await setPlaceReviewReaction.execute({
      reviewId: review.id,
      userId: 'viewer-1',
      type: 'on'
    })

    await setPlaceReviewReaction.execute({
      reviewId: review.id,
      userId: 'viewer-1',
      type: 'off'
    })

    const [item] = await listFollowingFeed.execute('viewer-1', 1)
    const [counts] = await mockRepo.listCountsByReviewIds([review.id])

    expect(item?.viewerReaction).toBe('off')
    expect(counts?.onCount).toBe(0)
    expect(counts?.offCount).toBe(1)
  })

  it('should remove a reaction', async () => {
    const review = await mockRepo.create({
      userId: 'author-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    await setPlaceReviewReaction.execute({
      reviewId: review.id,
      userId: 'viewer-1',
      type: 'on'
    })

    await removePlaceReviewReaction.execute({
      reviewId: review.id,
      userId: 'viewer-1'
    })

    const [item] = await listFollowingFeed.execute('viewer-1', 1)
    const [counts] = await mockRepo.listCountsByReviewIds([review.id])

    expect(item?.viewerReaction).toBeNull()
    expect(counts?.onCount).toBe(0)
  })
})
