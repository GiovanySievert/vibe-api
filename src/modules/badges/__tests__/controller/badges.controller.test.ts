import { beforeEach, describe, expect, it } from 'bun:test'
import { User } from 'better-auth/types'

import { MockPlaceReviewRepository } from '@src/modules/place-review/__tests__/mocks/place-review.repository.mock'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'

import {
  GetUserBadgeForPlace,
  ListUserBadgeProgress,
  ListUserBadges,
  ListVisibleUserBadges,
  UpdateUserProfileBadges
} from '../../application/use-cases'
import { BadgesController } from '../../infrastructure/http/controllers/badges.controller'
import { UserPlaceBadgeWithPlace } from '../../domain/repositories'
import { MockUserPlaceBadgesRepository } from '../mocks/user-place-badges.repository.mock'
import { MockUserProfileBadgesRepository } from '../mocks/user-profile-badges.repository.mock'

const makeUser = (id: string): User => ({ id, name: 'Test User', email: 'test@example.com' }) as User

const makeBadge = (userId: string, placeId: string): UserPlaceBadgeWithPlace => ({
  id: crypto.randomUUID(),
  userId,
  placeId,
  tier: 'regular',
  achievedAt: new Date(),
  place: {
    id: placeId,
    name: `place-${placeId}`,
    brandAvatar: null
  }
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
  createdAt: new Date(),
  updatedAt: new Date()
})

describe('BadgesController', () => {
  let controller: BadgesController
  let userProfileBadgesRepo: MockUserProfileBadgesRepository
  const userId = 'user-1'

  beforeEach(() => {
    const userPlaceBadgesRepo = new MockUserPlaceBadgesRepository()
    userProfileBadgesRepo = new MockUserProfileBadgesRepository()
    const placeReviewRepo = new MockPlaceReviewRepository()

    userPlaceBadgesRepo.seed([makeBadge(userId, 'place-1'), makeBadge(userId, 'place-2')])
    placeReviewRepo.seed([
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-1')),
      ...Array.from({ length: 3 }, () => makeReview(userId, 'place-2'))
    ])

    controller = new BadgesController(
      new ListUserBadges(userPlaceBadgesRepo, userProfileBadgesRepo, placeReviewRepo),
      new ListVisibleUserBadges(placeReviewRepo),
      new ListUserBadgeProgress(placeReviewRepo),
      new GetUserBadgeForPlace(userPlaceBadgesRepo, placeReviewRepo),
      new UpdateUserProfileBadges(placeReviewRepo, userProfileBadgesRepo)
    )
  })

  it('updates profile badge selection using the authenticated user', async () => {
    const result = await controller.updateProfileSelection({
      user: makeUser(userId),
      body: { placeIds: ['place-2', 'place-1'] }
    })

    expect(result.placeIds).toEqual(['place-2', 'place-1'])
    const stored = await userProfileBadgesRepo.listByUser(userId)
    expect(stored.map((profileBadgeSelection) => profileBadgeSelection.placeId)).toEqual(['place-2', 'place-1'])
  })
})
