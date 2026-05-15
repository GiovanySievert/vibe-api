import { beforeEach, describe, expect, it } from 'bun:test'

import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'

import { ListUserBadgeProgress } from '../../application/use-cases'

const makeReview = (userId: string, placeId: string, createdAt: Date): PlaceReview => ({
  id: crypto.randomUUID(),
  userId,
  placeId,
  placeName: `place-${placeId}`,
  rating: 'crowded',
  placeImageUrl: null,
  selfieUrl: null,
  selfieFriendsOnly: false,
  comment: null,
  createdAt,
  updatedAt: createdAt
})

describe('ListUserBadgeProgress', () => {
  let placeReviewRepo: MockPlaceReviewRepository
  let useCase: ListUserBadgeProgress
  const userId = 'user-1'

  beforeEach(() => {
    placeReviewRepo = new MockPlaceReviewRepository()
    useCase = new ListUserBadgeProgress(placeReviewRepo)
  })

  it('returns the next badge tier progress for places with reviews', async () => {
    placeReviewRepo.seed([
      ...Array.from({ length: 4 }, () => makeReview(userId, 'place-1', new Date('2026-01-01'))),
      ...Array.from({ length: 9 }, () => makeReview(userId, 'place-2', new Date('2026-01-01'))),
      ...Array.from({ length: 20 }, () => makeReview(userId, 'place-3', new Date('2026-01-01')))
    ])

    const badgeProgress = await useCase.execute(userId)

    expect(badgeProgress.map((progressBadge) => progressBadge.placeId)).toEqual(['place-2', 'place-1'])
    expect(badgeProgress[0]).toMatchObject({
      reviewCount: 9,
      targetReviewCount: 10,
      tier: 'frequent',
      label: 'VIP'
    })
    expect(badgeProgress[1]).toMatchObject({
      reviewCount: 4,
      targetReviewCount: 5,
      tier: 'fan',
      label: 'fã'
    })
  })

  it('includes first tier progress for places below the first badge threshold', async () => {
    placeReviewRepo.seed([makeReview(userId, 'place-1', new Date('2026-01-01'))])

    const badgeProgress = await useCase.execute(userId)

    expect(badgeProgress).toHaveLength(1)
    expect(badgeProgress[0]).toMatchObject({
      placeId: 'place-1',
      reviewCount: 1,
      targetReviewCount: 3,
      tier: 'regular'
    })
  })
})
