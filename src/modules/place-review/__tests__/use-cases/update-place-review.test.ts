import { describe, it, expect, beforeEach } from 'bun:test'

import { UpdatePlaceReview } from '../../application/use-cases/update-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('UpdatePlaceReview', () => {
  let updatePlaceReview: UpdatePlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    updatePlaceReview = new UpdatePlaceReview(mockRepo)
  })

  it('should update the rating of a review', async () => {
    const created = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    const updated = await updatePlaceReview.execute(created.id, { rating: 'dead' })

    expect(updated.rating).toBe('dead')
    expect(updated.userId).toBe('user-1')
    expect(updated.placeId).toBe('place-1')
  })

  it('should update the comment of a review', async () => {
    const created = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    const updated = await updatePlaceReview.execute(created.id, { comment: 'Tava cheio demais' })

    expect(updated.comment).toBe('Tava cheio demais')
    expect(updated.rating).toBe('crowded')
  })

  it('should update both rating and comment at once', async () => {
    const created = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: 'Boa noite'
    })

    const updated = await updatePlaceReview.execute(created.id, { rating: 'dead', comment: 'Mudou muito' })

    expect(updated.rating).toBe('dead')
    expect(updated.comment).toBe('Mudou muito')
  })
})
