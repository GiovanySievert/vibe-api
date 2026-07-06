import { beforeEach, describe, expect, it } from 'bun:test'

import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'

import { UpdateUserProfileBadges } from '../../application/use-cases'
import {
  DuplicateProfileBadgeSelectionException,
  InvalidProfileBadgeSelectionException,
  ProfileBadgeSelectionLimitException
} from '../../domain/exceptions'
import { MockUserProfileBadgesRepository } from '../mocks/user-profile-badges.repository.mock'

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

describe('UpdateUserProfileBadges', () => {
  let userProfileBadgesRepo: MockUserProfileBadgesRepository
  let useCase: UpdateUserProfileBadges
  const userId = 'user-1'

  beforeEach(() => {
    userProfileBadgesRepo = new MockUserProfileBadgesRepository()
    const placeReviewRepo = new MockPlaceReviewRepository()
    useCase = new UpdateUserProfileBadges(placeReviewRepo, userProfileBadgesRepo)
    placeReviewRepo.seed([
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-1', new Date('2026-01-01'))),
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-2', new Date('2026-01-01'))),
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-3', new Date('2026-01-01')))
    ])
  })

  it('saves up to three places in order', async () => {
    const result = await useCase.execute({ userId, placeIds: ['place-2', 'place-1', 'place-3'] })

    expect(result.placeIds).toEqual(['place-2', 'place-1', 'place-3'])
    const stored = await userProfileBadgesRepo.listByUser(userId)
    expect(stored.map((profileBadgeSelection) => profileBadgeSelection.placeId)).toEqual(['place-2', 'place-1', 'place-3'])
    expect(stored.map((profileBadgeSelection) => profileBadgeSelection.position)).toEqual([1, 2, 3])
  })

  it('saves an empty selection', async () => {
    await useCase.execute({ userId, placeIds: ['place-1'] })

    const result = await useCase.execute({ userId, placeIds: [] })

    expect(result.placeIds).toEqual([])
    expect(await userProfileBadgesRepo.listByUser(userId)).toEqual([])
  })

  it('rejects more than three places', async () => {
    await expect(
      useCase.execute({ userId, placeIds: ['place-1', 'place-2', 'place-3', 'place-4'] })
    ).rejects.toThrow(ProfileBadgeSelectionLimitException)
  })

  it('rejects duplicate places', async () => {
    await expect(useCase.execute({ userId, placeIds: ['place-1', 'place-1'] })).rejects.toThrow(
      DuplicateProfileBadgeSelectionException
    )
  })

  it('rejects places without an earned badge', async () => {
    await expect(useCase.execute({ userId, placeIds: ['place-4'] })).rejects.toThrow(
      InvalidProfileBadgeSelectionException
    )
  })

  it('replaces the previous selection', async () => {
    await useCase.execute({ userId, placeIds: ['place-1', 'place-2'] })
    await useCase.execute({ userId, placeIds: ['place-3'] })

    const stored = await userProfileBadgesRepo.listByUser(userId)
    expect(stored.map((profileBadgeSelection) => profileBadgeSelection.placeId)).toEqual(['place-3'])
  })
})
