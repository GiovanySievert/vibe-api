import { describe, it, expect, beforeEach } from 'bun:test'

import { ListFollowingFeed } from '../../application/use-cases/list-following-feed'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'
import { MockFollowChecker } from '../mocks/follow-checker.mock'

describe('ListFollowingFeed', () => {
  let listFollowingFeed: ListFollowingFeed
  let mockRepo: MockPlaceReviewRepository
  let mockFollowChecker: MockFollowChecker

  beforeEach(() => {
    mockRepo = new MockPlaceReviewRepository()
    mockFollowChecker = new MockFollowChecker()
    listFollowingFeed = new ListFollowingFeed(mockRepo, mockFollowChecker)
  })

  it('shows a public selfie from a followed author', async () => {
    mockFollowChecker.addFollow('viewer-1', 'user-1')
    await mockRepo.create({
      userId: 'user-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: 'http://example.com/selfie.jpg',
      selfieThumbnailUrl: 'http://example.com/selfie-thumb.jpg',
      selfieFriendsOnly: false,
      comment: null
    })

    const result = await listFollowingFeed.execute('viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBe('http://example.com/selfie.jpg')
    expect(result[0].selfieThumbnailUrl).toBe('http://example.com/selfie-thumb.jpg')
  })

  it('shows a friendsOnly selfie when the viewer follows the author (one-way is enough)', async () => {
    mockFollowChecker.addFollow('viewer-1', 'user-1')
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

    const result = await listFollowingFeed.execute('viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBe('http://example.com/selfie.jpg')
  })

  it('keeps the friendsOnly selfie when the viewer is the author', async () => {
    await mockRepo.create({
      userId: 'viewer-1',
      placeId: 'place-1',
      placeName: 'place-1',
      rating: 'crowded',
      placeImageUrl: null,
      selfieUrl: 'http://example.com/self.jpg',
      selfieFriendsOnly: true,
      comment: null
    })

    const result = await listFollowingFeed.execute('viewer-1')

    expect(result).toHaveLength(1)
    expect(result[0].selfieUrl).toBe('http://example.com/self.jpg')
  })
})
