import { describe, it, expect, beforeEach } from 'bun:test'

import { ListPlaceReviews } from '../../application/use-cases/list-place-reviews'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('ListPlaceReviews', () => {
  let listPlaceReviews: ListPlaceReviews
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    listPlaceReviews = new ListPlaceReviews(mockRepo)
  })

  it('should list reviews by place', async () => {
    await mockRepo.create({ userId: 'user-1', placeId: 'place-1', rating: 'crowded', imageUrl: null, comment: null })
    await mockRepo.create({ userId: 'user-2', placeId: 'place-1', rating: 'dead', imageUrl: null, comment: null })
    await mockRepo.create({ userId: 'user-3', placeId: 'place-2', rating: 'crowded', imageUrl: null, comment: null })

    const result = await listPlaceReviews.executeByPlace('place-1')

    expect(result).toHaveLength(2)
    expect(result.every((r) => r.placeId === 'place-1')).toBe(true)
  })

  it('should list reviews by user', async () => {
    await mockRepo.create({ userId: 'user-1', placeId: 'place-1', rating: 'crowded', imageUrl: null, comment: null })
    await mockRepo.create({ userId: 'user-1', placeId: 'place-2', rating: 'dead', imageUrl: null, comment: null })
    await mockRepo.create({ userId: 'user-2', placeId: 'place-1', rating: 'crowded', imageUrl: null, comment: null })

    const result = await listPlaceReviews.executeByUser('user-1')

    expect(result).toHaveLength(2)
    expect(result.every((r) => r.userId === 'user-1')).toBe(true)
  })

  it('should return empty array when no reviews exist for a place', async () => {
    const result = await listPlaceReviews.executeByPlace('place-sem-reviews')

    expect(result).toHaveLength(0)
  })

  it('should paginate — only return up to 10 results per page', async () => {
    for (let i = 0; i < 12; i++) {
      await mockRepo.create({
        userId: `user-${i}`,
        placeId: 'place-1',
        rating: 'crowded',
        imageUrl: null,
        comment: null
      })
    }

    const page1 = await listPlaceReviews.executeByPlace('place-1', 1)
    const page2 = await listPlaceReviews.executeByPlace('place-1', 2)

    expect(page1).toHaveLength(10)
    expect(page2).toHaveLength(2)
  })
})
