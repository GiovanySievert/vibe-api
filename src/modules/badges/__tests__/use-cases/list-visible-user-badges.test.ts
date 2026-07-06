import { beforeEach, describe, expect, it, mock } from 'bun:test'

import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'

import { ListVisibleUserBadges } from '../../application/use-cases'

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

describe('ListVisibleUserBadges', () => {
  let placeReviewRepo: MockPlaceReviewRepository
  let useCase: ListVisibleUserBadges
  const userId = 'user-1'

  beforeEach(() => {
    placeReviewRepo = new MockPlaceReviewRepository()
    useCase = new ListVisibleUserBadges(placeReviewRepo)
  })

  it('returns only selected badges ordered by profile position', async () => {
    placeReviewRepo.seed([
      ...Array.from({ length: 5 }, () => makeReview(userId, 'place-fan', new Date('2026-01-05'))),
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-regular', new Date('2026-01-03'))),
      ...Array.from({ length: 4 }, () => makeReview(userId, 'place-hidden', new Date('2026-01-04')))
    ])
    placeReviewRepo.seedProfileBadgeSelections(userId, [
      { placeId: 'place-regular', position: 1 },
      { placeId: 'place-fan', position: 2 }
    ])

    const result = await useCase.execute(userId)

    expect(result.map((badgeSummary) => badgeSummary.placeId)).toEqual(['place-regular', 'place-fan'])
    expect(result.map((badgeSummary) => badgeSummary.profilePosition)).toEqual([1, 2])
    expect(result.every((badgeSummary) => badgeSummary.visibleOnProfile)).toBe(true)
    const fanSummary = result.find((badgeSummary) => badgeSummary.placeId === 'place-fan')
    expect(fanSummary?.tiers.map((tier) => tier.tier)).toEqual(['regular', 'fan'])
    expect(result.some((badgeSummary) => badgeSummary.placeId === 'place-hidden')).toBe(false)
  })

  it('returns an empty array when the user has no profile badge selections', async () => {
    placeReviewRepo.seed(
      Array.from({ length: 10 }, () => makeReview(userId, 'place-1', new Date('2026-01-01')))
    )

    const result = await useCase.execute(userId)

    expect(result).toEqual([])
  })

  it('skips selected places whose review count has not unlocked any tier', async () => {
    placeReviewRepo.seed([
      makeReview(userId, 'place-below', new Date('2026-01-01')),
      makeReview(userId, 'place-below', new Date('2026-01-02'))
    ])
    placeReviewRepo.seedProfileBadgeSelections(userId, [
      { placeId: 'place-below', position: 1 }
    ])

    const result = await useCase.execute(userId)

    expect(result).toEqual([])
  })

  it('propagates errors from the review repository', async () => {
    const brokenRepo = {
      listSelectedReviewCountsByUserGroupedByPlace: mock(async () => {
        throw new Error('selection query failed')
      })
    } as unknown as MockPlaceReviewRepository
    const brokenUseCase = new ListVisibleUserBadges(brokenRepo)

    await expect(brokenUseCase.execute(userId)).rejects.toThrow('selection query failed')
  })
})
