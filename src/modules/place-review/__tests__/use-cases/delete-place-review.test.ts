import { describe, it, expect, beforeEach } from 'bun:test'

import { DeletePlaceReview } from '../../application/use-cases/delete-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'
import { EvaluateUserPlaceBadge } from '@src/modules/badges/application/use-cases'

class NoopEvaluateBadge {
  async execute(): Promise<void> {}
}

describe('DeletePlaceReview', () => {
  let deletePlaceReview: DeletePlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    deletePlaceReview = new DeletePlaceReview(
      mockRepo,
      new NoopEvaluateBadge() as unknown as EvaluateUserPlaceBadge
    )
  })

  it('should delete a review by id', async () => {
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

    await deletePlaceReview.execute(created.id, 'user-1')

    const found = await mockRepo.getById(created.id)
    expect(found).toBeNull()
  })

  it('should not affect other reviews when deleting one', async () => {
    const r1 = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })
    const r2 = await mockRepo.create({
      userId: 'user-2',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'dead',
      placeImageUrl: null,
      selfieUrl: null,
      selfieFriendsOnly: false,
      comment: null
    })

    await deletePlaceReview.execute(r1.id, 'user-1')

    const found = await mockRepo.getById(r2.id)
    expect(found).not.toBeNull()
    expect(mockRepo.getAll()).toHaveLength(1)
  })
})
