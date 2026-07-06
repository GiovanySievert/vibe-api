import { describe, it, expect, beforeEach } from 'bun:test'

import { ListFollowingFeed } from '../../application/use-cases/list-following-feed'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

describe('ListFollowingFeed', () => {
  let listFollowingFeed: ListFollowingFeed
  let mockRepo: MockPlaceReviewRepository

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    listFollowingFeed = new ListFollowingFeed(mockRepo)
  })

  it('shows a public selfie and the author on a non-anonymous review', async () => {
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieThumbnailUrl: 'http://example.com/selfie-thumb.jpg',
      isAnonymous: false,
      comment: null
    })

    const result = await listFollowingFeed.execute('viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBe('http://example.com/selfie.jpg')
    expect(result[0].user?.username).toBe('user-user-1')
    expect(result[0].isAnonymous).toBe(false)
  })

  it('de-identifies an anonymous review from another author', async () => {
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: 'http://example.com/place.jpg',
      selfieUrl: null,
      isAnonymous: true,
      comment: null
    })

    const result = await listFollowingFeed.execute('viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBeNull()
    expect(result[0].user).toBeNull()
    expect(result[0].isAnonymous).toBe(true)
    expect(result[0].isOwnAnonymous).toBe(false)
  })

  it('marks the own anonymous review with isOwnAnonymous while still hiding identity', async () => {
    await mockRepo.create({
      userId: 'viewer-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: 'http://example.com/place.jpg',
      selfieUrl: null,
      isAnonymous: true,
      comment: null
    })

    const result = await listFollowingFeed.execute('viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBeNull()
    expect(result[0].user).toBeNull()
    expect(result[0].isOwnAnonymous).toBe(true)
  })
})
