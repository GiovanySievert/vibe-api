import { describe, expect, it } from 'bun:test'

import { ListPlaceReviewFriends } from '../../application/use-cases/list-place-review-friends'
import { PlaceReview } from '../../domain/mappers'
import { MockPlaceReviewRepository } from '../mocks/place-review.repository.mock'

const makeReview = (overrides: Partial<PlaceReview> = {}): PlaceReview => ({
  id: crypto.randomUUID(),
  userId: 'user-1',
  placeId: 'place-1',
  placeName: 'Bar',
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  selfieFriendsOnly: false,
  comment: null,
  createdAt: new Date('2026-05-01T00:00:00Z'),
  updatedAt: new Date('2026-05-01T00:00:00Z'),
  ...overrides
})

describe('ListPlaceReviewFriends', () => {
  it('returns only followed users who reviewed the place within the window', async () => {
    const repo = new MockPlaceReviewRepository()
    const useCase = new ListPlaceReviewFriends(repo)
    repo.seedFollows([
      { followerId: 'viewer-1', followingId: 'friend-1' },
      { followerId: 'viewer-1', followingId: 'friend-2' }
    ])
    repo.seed([
      makeReview({
        userId: 'friend-1',
        placeId: 'place-1',
        createdAt: new Date('2026-05-01T00:00:00Z')
      }),
      makeReview({
        userId: 'stranger-1',
        placeId: 'place-1',
        createdAt: new Date('2026-05-02T00:00:00Z')
      }),
      makeReview({
        userId: 'friend-2',
        placeId: 'place-2',
        createdAt: new Date('2026-05-03T00:00:00Z')
      }),
      makeReview({
        userId: 'friend-2',
        placeId: 'place-1',
        createdAt: new Date('2026-01-01T00:00:00Z')
      }),
      makeReview({
        userId: 'viewer-1',
        placeId: 'place-1',
        createdAt: new Date('2026-05-04T00:00:00Z')
      })
    ])

    const result = await useCase.execute({
      placeId: 'place-1',
      viewerId: 'viewer-1',
      since: new Date('2026-02-17T00:00:00Z'),
      page: 1,
      limit: 10
    })

    expect(result.total).toBe(1)
    expect(result.data.map((friend) => friend.id)).toEqual(['friend-1'])
    expect(result.data[0].name).toBe('Name friend-1')
    expect(result.data[0].username).toBe('user-friend-1')
  })

  it('deduplicates friends and orders them by latest review date', async () => {
    const repo = new MockPlaceReviewRepository()
    const useCase = new ListPlaceReviewFriends(repo)
    repo.seedFollows([
      { followerId: 'viewer-1', followingId: 'friend-1' },
      { followerId: 'viewer-1', followingId: 'friend-2' }
    ])
    repo.seed([
      makeReview({
        userId: 'friend-1',
        createdAt: new Date('2026-05-01T00:00:00Z')
      }),
      makeReview({
        userId: 'friend-1',
        createdAt: new Date('2026-05-05T00:00:00Z')
      }),
      makeReview({
        userId: 'friend-2',
        createdAt: new Date('2026-05-04T00:00:00Z')
      })
    ])

    const result = await useCase.execute({
      placeId: 'place-1',
      viewerId: 'viewer-1',
      since: new Date('2026-02-17T00:00:00Z'),
      page: 1,
      limit: 10
    })

    expect(result.total).toBe(2)
    expect(result.data.map((friend) => friend.id)).toEqual(['friend-1', 'friend-2'])
    expect(result.data[0].latestReviewAt.toISOString()).toBe('2026-05-05T00:00:00.000Z')
  })

  it('paginates unique friends with total and hasMore', async () => {
    const repo = new MockPlaceReviewRepository()
    const useCase = new ListPlaceReviewFriends(repo)
    repo.seedFollows([
      { followerId: 'viewer-1', followingId: 'friend-1' },
      { followerId: 'viewer-1', followingId: 'friend-2' },
      { followerId: 'viewer-1', followingId: 'friend-3' }
    ])
    repo.seed([
      makeReview({
        userId: 'friend-1',
        createdAt: new Date('2026-05-03T00:00:00Z')
      }),
      makeReview({
        userId: 'friend-2',
        createdAt: new Date('2026-05-02T00:00:00Z')
      }),
      makeReview({
        userId: 'friend-3',
        createdAt: new Date('2026-05-01T00:00:00Z')
      })
    ])

    const page = await useCase.execute({
      placeId: 'place-1',
      viewerId: 'viewer-1',
      since: new Date('2026-02-17T00:00:00Z'),
      page: 2,
      limit: 2
    })

    expect(page.data.map((friend) => friend.id)).toEqual(['friend-3'])
    expect(page.total).toBe(3)
    expect(page.hasMore).toBe(false)
    expect(page.page).toBe(2)
    expect(page.limit).toBe(2)
  })
})
