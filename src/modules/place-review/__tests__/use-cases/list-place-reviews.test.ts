import { describe, it, expect, beforeEach } from 'bun:test'

import { ListPlaceReviews } from '../../application/use-cases/list-place-reviews'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'
import { MockFollowChecker } from '../mocks/follow-checker.mock'

describe('ListPlaceReviews', () => {
  let listPlaceReviews: ListPlaceReviews
  let mockRepo: MockPlaceReviewRepository
  let mockFollowChecker: MockFollowChecker
  const since = new Date(0)

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    mockFollowChecker = new MockFollowChecker()
    listPlaceReviews = new ListPlaceReviews(mockRepo, mockFollowChecker)
  })

  it('should list reviews by place', async () => {
    await mockRepo.create({ userId: 'user-1', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-2', placeId: 'place-1', placeName: 'place-1', rating: 'dead', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-3', placeId: 'place-2', placeName: 'place-2', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })

    const result = await listPlaceReviews.executeByPlace('place-1', since, undefined, 'viewer-1')

    expect(result).toHaveLength(2)
    expect(result.every((r) => r.placeId === 'place-1')).toBe(true)
  })

  it('should hide reviews when viewer and author are blocked in either direction', async () => {
    await mockRepo.create({ userId: 'user-1', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-2', placeId: 'place-1', placeName: 'place-1', rating: 'dead', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-3', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    mockRepo.seedBlocks([
      { blockerId: 'viewer-1', blockedId: 'user-1' },
      { blockerId: 'user-2', blockedId: 'viewer-1' }
    ])

    const result = await listPlaceReviews.executeByPlace('place-1', since, undefined, 'viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-3')
  })

  it('should list reviews by user', async () => {
    await mockRepo.create({ userId: 'user-1', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-1', placeId: 'place-2', placeName: 'place-2', rating: 'dead', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-2', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })

    const result = await listPlaceReviews.executeByUser('user-1', undefined, 'viewer-1')

    expect(result).toHaveLength(2)
    expect(result.every((r) => r.userId === 'user-1')).toBe(true)
  })

  it('should return image thumbnails when listing reviews by user', async () => {
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: 'http://example.com/place.jpg',
      placeImageThumbnailUrl: 'http://example.com/place-thumb.jpg',
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieThumbnailUrl: 'http://example.com/selfie-thumb.jpg',
      selfieFriendsOnly: false,
      comment: null
    })

    const result = await listPlaceReviews.executeByUser('user-1', undefined, 'viewer-1')

    expect(result[0].placeImageThumbnailUrl).toBe('http://example.com/place-thumb.jpg')
    expect(result[0].selfieThumbnailUrl).toBe('http://example.com/selfie-thumb.jpg')
  })

  it('should return no reviews by user when viewer is blocked by that user', async () => {
    await mockRepo.create({ userId: 'user-1', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    mockRepo.seedBlocks([{ blockerId: 'user-1', blockedId: 'viewer-1' }])

    const result = await listPlaceReviews.executeByUser('user-1', undefined, 'viewer-1')

    expect(result).toHaveLength(0)
  })

  it('should list the favorite review first for a user', async () => {
    const older = await mockRepo.create({ userId: 'user-1', placeId: 'place-1', placeName: 'place-1', rating: 'crowded', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.create({ userId: 'user-1', placeId: 'place-2', placeName: 'place-2', rating: 'dead', placeImageUrl: null, selfieUrl: null, selfieFriendsOnly: false, comment: null })
    await mockRepo.favoriteReview('user-1', older.id)

    const result = await listPlaceReviews.executeByUser('user-1', undefined, 'viewer-1')

    expect(result[0].id).toBe(older.id)
    expect(result[0].isFavorite).toBe(true)
  })

  it('should return empty array when no reviews exist for a place', async () => {
    const result = await listPlaceReviews.executeByPlace('place-sem-reviews', since, undefined, 'viewer-1')

    expect(result).toHaveLength(0)
  })

  it('should paginate — only return up to 10 results per page', async () => {
    for (let i = 0; i < 12; i++) {
      await mockRepo.create({
        userId: `user-${i}`,
        placeId: 'place-1',
      placeName: 'place-1',
        rating: 'crowded',
        placeImageUrl: null,
        selfieUrl: null,
        selfieFriendsOnly: false,
        comment: null
      })
    }

    const page1 = await listPlaceReviews.executeByPlace('place-1', since, 1, 'viewer-1')
    const page2 = await listPlaceReviews.executeByPlace('place-1', since, 2, 'viewer-1')

    expect(page1).toHaveLength(10)
    expect(page2).toHaveLength(2)
  })

  it('should hide a private selfie when the viewer does not follow the author', async () => {
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieThumbnailUrl: 'http://example.com/selfie-thumb.jpg',
      selfieFriendsOnly: true,
      comment: null
    })

    const result = await listPlaceReviews.executeByPlace('place-1', since, 1, 'user-2')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBeNull()
    expect(result[0].selfieThumbnailUrl).toBeNull()
  })

  it('should show a private selfie when the viewer follows the author', async () => {
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieFriendsOnly: true,
      comment: null
    })
    mockFollowChecker.addFollow('user-2', 'user-1')

    const result = await listPlaceReviews.executeByPlace('place-1', since, 1, 'user-2')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBe('http://example.com/selfie.jpg')
  })

  it('should keep the private selfie when the viewer is the author', async () => {
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieFriendsOnly: true,
      comment: null
    })

    const result = await listPlaceReviews.executeByPlace('place-1', since, 1, 'user-1')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBe('http://example.com/selfie.jpg')
  })
})
