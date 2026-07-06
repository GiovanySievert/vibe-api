import { beforeEach, describe, expect, it } from 'bun:test'

import { FavoritePlaceReview } from '../../application/use-cases/favorite-place-review'
import { UnfavoritePlaceReview } from '../../application/use-cases/unfavorite-place-review'
import { PlaceReviewNotFoundException, UnauthorizedPlaceReviewActionException } from '../../domain/exceptions'
import { PlaceReview } from '../../domain/mappers'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

const makeReviewData = (overrides: Partial<PlaceReview> = {}): Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'> => ({
  userId: 'user-1',
  placeId: 'place-1',
  placeName: 'place-1',
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  isAnonymous: false,
  comment: null,
  ...overrides
})

describe('FavoritePlaceReview', () => {
  let favoritePlaceReview: FavoritePlaceReview
  let unfavoritePlaceReview: UnfavoritePlaceReview
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    favoritePlaceReview = new FavoritePlaceReview(mockRepo)
    unfavoritePlaceReview = new UnfavoritePlaceReview(mockRepo)
  })

  it('should favorite an owned review', async () => {
    const review = await mockRepo.create(makeReviewData())

    await favoritePlaceReview.execute(review.id, 'user-1')

    const [item] = await mockRepo.listByUser('user-1')
    expect(item.id).toBe(review.id)
    expect(item.isFavorite).toBe(true)
  })

  it('should replace the previous favorite review for the same user', async () => {
    const first = await mockRepo.create(makeReviewData({ placeId: 'place-1', placeName: 'place-1' }))
    const second = await mockRepo.create(makeReviewData({ placeId: 'place-2', placeName: 'place-2' }))

    await favoritePlaceReview.execute(first.id, 'user-1')
    await favoritePlaceReview.execute(second.id, 'user-1')

    const items = await mockRepo.listByUser('user-1')
    expect(items[0].id).toBe(second.id)
    expect(items.find((item) => item.id === first.id)?.isFavorite).toBe(false)
    expect(items.find((item) => item.id === second.id)?.isFavorite).toBe(true)
  })

  it('should unfavorite the current favorite review', async () => {
    const review = await mockRepo.create(makeReviewData())

    await favoritePlaceReview.execute(review.id, 'user-1')
    await unfavoritePlaceReview.execute(review.id, 'user-1')

    const [item] = await mockRepo.listByUser('user-1')
    expect(item.isFavorite).toBe(false)
  })

  it('should not unfavorite another current favorite review', async () => {
    const first = await mockRepo.create(makeReviewData({ placeId: 'place-1', placeName: 'place-1' }))
    const second = await mockRepo.create(makeReviewData({ placeId: 'place-2', placeName: 'place-2' }))

    await favoritePlaceReview.execute(second.id, 'user-1')
    await unfavoritePlaceReview.execute(first.id, 'user-1')

    const items = await mockRepo.listByUser('user-1')
    expect(items.find((item) => item.id === second.id)?.isFavorite).toBe(true)
  })

  it('should reject favoriting a missing review', async () => {
    await expect(favoritePlaceReview.execute('missing', 'user-1')).rejects.toBeInstanceOf(PlaceReviewNotFoundException)
  })

  it('should reject favoriting another user review', async () => {
    const review = await mockRepo.create(makeReviewData({ userId: 'user-2' }))

    await expect(favoritePlaceReview.execute(review.id, 'user-1')).rejects.toBeInstanceOf(
      UnauthorizedPlaceReviewActionException
    )
  })

  it('should reject unfavoriting a missing review', async () => {
    await expect(unfavoritePlaceReview.execute('missing', 'user-1')).rejects.toBeInstanceOf(PlaceReviewNotFoundException)
  })

  it('should reject unfavoriting another user review', async () => {
    const review = await mockRepo.create(makeReviewData({ userId: 'user-2' }))

    await expect(unfavoritePlaceReview.execute(review.id, 'user-1')).rejects.toBeInstanceOf(
      UnauthorizedPlaceReviewActionException
    )
  })
})
