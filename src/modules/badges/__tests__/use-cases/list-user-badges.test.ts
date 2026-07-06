import { beforeEach, describe, expect, it } from 'bun:test'

import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'

import { ListUserBadges, ListVisibleUserBadges } from '../../application/use-cases'
import { UserPlaceBadgeWithPlace } from '../../domain/repositories'
import { MockUserPlaceBadgesRepository } from '../mocks/user-place-badges.repository.mock'
import { MockUserProfileBadgesRepository } from '../mocks/user-profile-badges.repository.mock'

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
  place: {
    id: placeId,
    name: `place-${placeId}`,
    brandAvatar: null
  }
})

const makeReview = (userId: string, placeId: string, createdAt: Date): PlaceReview => ({
  id: crypto.randomUUID(),
  userId,
  placeId,
  placeName: `place-${placeId}`,
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  isAnonymous: false,
  comment: null,
  createdAt,
  updatedAt: createdAt
})

describe('ListUserBadges', () => {
  let userPlaceBadgesRepo: MockUserPlaceBadgesRepository
  let userProfileBadgesRepo: MockUserProfileBadgesRepository
  let placeReviewRepo: MockPlaceReviewRepository
  let useCase: ListUserBadges
  let visibleUseCase: ListVisibleUserBadges
  const userId = 'user-1'

  beforeEach(() => {
    userPlaceBadgesRepo = new MockUserPlaceBadgesRepository()
    userProfileBadgesRepo = new MockUserProfileBadgesRepository()
    placeReviewRepo = new MockPlaceReviewRepository()
    useCase = new ListUserBadges(userPlaceBadgesRepo, userProfileBadgesRepo, placeReviewRepo)
    visibleUseCase = new ListVisibleUserBadges(placeReviewRepo)

    userPlaceBadgesRepo.seed([
      makeBadge(userId, 'place-1', 'regular', new Date('2026-01-01')),
      makeBadge(userId, 'place-1', 'fan', new Date('2026-01-02')),
      makeBadge(userId, 'place-2', 'regular', new Date('2026-01-03')),
      makeBadge(userId, 'place-3', 'regular', new Date('2026-01-04'))
    ])

    placeReviewRepo.seed([
      ...Array.from({ length: 5 }, () => makeReview(userId, 'place-1', new Date('2026-01-01'))),
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-2', new Date('2026-01-01'))),
      ...Array.from({ length: 4 }, () => makeReview(userId, 'place-3', new Date('2026-01-01')))
    ])

    userProfileBadgesRepo.seed([
      { userId, placeId: 'place-3', position: 1, selectedAt: new Date('2026-02-01') },
      { userId, placeId: 'place-1', position: 2, selectedAt: new Date('2026-02-01') }
    ])
    placeReviewRepo.seedProfileBadgeSelections(userId, [
      { placeId: 'place-3', position: 1 },
      { placeId: 'place-1', position: 2 }
    ])
  })

  it('returns all badges with profile visibility flags for management', async () => {
    const result = await useCase.execute(userId)

    expect(result.map((badgeSummary) => badgeSummary.placeId)).toEqual(['place-1', 'place-3', 'place-2'])
    expect(result.map((badgeSummary) => badgeSummary.visibleOnProfile)).toEqual([true, true, false])
    expect(result.map((badgeSummary) => badgeSummary.profilePosition)).toEqual([2, 1, null])
    expect(result[0].tiers.map((tier) => tier.tier)).toEqual(['regular', 'fan'])
  })

  it('returns only selected badges in profile order for public profile', async () => {
    const result = await visibleUseCase.execute(userId)

    expect(result.map((badgeSummary) => badgeSummary.placeId)).toEqual(['place-3', 'place-1'])
    expect(result.map((badgeSummary) => badgeSummary.profilePosition)).toEqual([1, 2])
    expect(userPlaceBadgesRepo.listByUserCalls).toBe(0)
  })

  it('derives unlocked badges from review count when persisted badges are missing', async () => {
    userPlaceBadgesRepo.seed([])
    placeReviewRepo.seed([
      ...Array.from({ length: 3 }, () => makeReview(userId, 'james-bar', new Date('2026-01-01')))
    ])

    const result = await useCase.execute(userId)

    expect(result).toHaveLength(1)
    expect(result[0].placeId).toBe('james-bar')
    expect(result[0].tiers.map((tier) => tier.tier)).toEqual(['regular'])
    expect(result[0].reviewCount).toBe(3)
  })
})
