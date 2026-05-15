import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'

import { GetUserBadgeForPlace } from '../../application/use-cases'
import { UserPlaceBadgeWithPlace } from '../../domain/repositories'
import { MockUserPlaceBadgesRepository } from '../mocks/user-place-badges.repository.mock'

const makeBadge = (
  userId: string,
  placeId: string,
  tier: UserPlaceBadgeWithPlace['tier'],
  achievedAt: Date
): UserPlaceBadgeWithPlace => ({
  id: crypto.randomUUID(),
  userId,
  placeId,
  tier,
  achievedAt,
  place: { id: placeId, name: `place-${placeId}`, brandAvatar: null }
})

const makeReview = (userId: string, placeId: string): PlaceReview => ({
  id: crypto.randomUUID(),
  userId,
  placeId,
  placeName: `place-${placeId}`,
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  selfieFriendsOnly: false,
  comment: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
})

describe('GetUserBadgeForPlace', () => {
  let userPlaceBadgesRepo: MockUserPlaceBadgesRepository
  let placeReviewRepo: MockPlaceReviewRepository
  let useCase: GetUserBadgeForPlace
  const userId = 'user-1'
  const placeId = 'place-1'

  beforeEach(() => {
    userPlaceBadgesRepo = new MockUserPlaceBadgesRepository()
    placeReviewRepo = new MockPlaceReviewRepository()
    useCase = new GetUserBadgeForPlace(userPlaceBadgesRepo, placeReviewRepo)
  })

  it('returns tiers sorted by canonical order with the matching review count', async () => {
    userPlaceBadgesRepo.seed([
      makeBadge(userId, placeId, 'fan', new Date('2026-01-05')),
      makeBadge(userId, placeId, 'regular', new Date('2026-01-04'))
    ])
    placeReviewRepo.seed(Array.from({ length: 5 }, () => makeReview(userId, placeId)))

    const result = await useCase.execute(userId, placeId)

    expect(result.userId).toBe(userId)
    expect(result.placeId).toBe(placeId)
    expect(result.reviewCount).toBe(5)
    expect(result.tiers.map((tier) => tier.tier)).toEqual(['regular', 'fan'])
    expect(result.tiers.map((tier) => tier.label)).toEqual(['cliente', 'fã'])
  })

  it('returns an empty tier list when the user has no badges or reviews for the place', async () => {
    const result = await useCase.execute(userId, placeId)

    expect(result).toEqual({
      userId,
      placeId,
      reviewCount: 0,
      tiers: []
    })
  })

  it('ignores badges that belong to other users or other places', async () => {
    userPlaceBadgesRepo.seed([
      makeBadge(userId, 'other-place', 'regular', new Date('2026-01-01')),
      makeBadge('other-user', placeId, 'fan', new Date('2026-01-02')),
      makeBadge(userId, placeId, 'regular', new Date('2026-01-03'))
    ])
    placeReviewRepo.seed([
      makeReview(userId, placeId),
      makeReview(userId, placeId),
      makeReview(userId, placeId),
      makeReview('other-user', placeId),
      makeReview(userId, 'other-place')
    ])

    const result = await useCase.execute(userId, placeId)

    expect(result.tiers.map((tier) => tier.tier)).toEqual(['regular'])
    expect(result.reviewCount).toBe(3)
  })

  it('propagates errors thrown by the badges repository', async () => {
    const brokenBadgesRepo = {
      getByUserAndPlace: mock(async () => {
        throw new Error('badges db down')
      })
    } as unknown as MockUserPlaceBadgesRepository
    const brokenUseCase = new GetUserBadgeForPlace(brokenBadgesRepo, placeReviewRepo)

    await expect(brokenUseCase.execute(userId, placeId)).rejects.toThrow('badges db down')
  })

  it('propagates errors thrown by the review repository', async () => {
    const brokenReviewRepo = {
      countReviewsByUserAndPlace: mock(async () => {
        throw new Error('review db down')
      })
    } as unknown as MockPlaceReviewRepository
    const brokenUseCase = new GetUserBadgeForPlace(userPlaceBadgesRepo, brokenReviewRepo)

    await expect(brokenUseCase.execute(userId, placeId)).rejects.toThrow('review db down')
  })
})
