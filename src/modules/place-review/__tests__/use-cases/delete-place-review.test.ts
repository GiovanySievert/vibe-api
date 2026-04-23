import { describe, it, expect, beforeEach } from 'bun:test'

import { DeletePlaceReview } from '../../application/use-cases/delete-place-review'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('DeletePlaceReview', () => {
  let deletePlaceReview: DeletePlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    deletePlaceReview = new DeletePlaceReview(mockRepo)
  })

  it('should delete a review by id', async () => {
    const created = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      rating: 'crowded',
      imageUrl: null,
      comment: null
    })

    await deletePlaceReview.execute(created.id)

    const found = await mockRepo.getById(created.id)
    expect(found).toBeNull()
  })

  it('should not affect other reviews when deleting one', async () => {
    const r1 = await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      rating: 'crowded',
      imageUrl: null,
      comment: null
    })
    const r2 = await mockRepo.create({
      userId: 'user-2',
      placeId: 'place-1',
      rating: 'dead',
      imageUrl: null,
      comment: null
    })

    await deletePlaceReview.execute(r1.id)

    const found = await mockRepo.getById(r2.id)
    expect(found).not.toBeNull()
    expect(mockRepo.getAll()).toHaveLength(1)
  })
})
