import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

import {
  DuplicateProfileBadgeSelectionException,
  InvalidProfileBadgeSelectionException,
  ProfileBadgeSelectionLimitException
} from '../../domain/exceptions'
import { highestTierFor } from '../constants/place-review-badge-tiers'
import { UserProfileBadgesRepository } from '../../domain/repositories'

export interface UpdateUserProfileBadgesInput {
  userId: string
  placeIds: string[]
}

export interface UpdateUserProfileBadgesOutput {
  placeIds: string[]
}

export class UpdateUserProfileBadges {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly userProfileBadgesRepo: UserProfileBadgesRepository
  ) {}

  async execute(input: UpdateUserProfileBadgesInput): Promise<UpdateUserProfileBadgesOutput> {
    if (input.placeIds.length > 3) {
      throw new ProfileBadgeSelectionLimitException()
    }

    if (new Set(input.placeIds).size !== input.placeIds.length) {
      throw new DuplicateProfileBadgeSelectionException()
    }

    const placeReviewCounts = await this.placeReviewRepo.listReviewCountsByUserGroupedByPlace(input.userId)
    const earnedPlaceIds = new Set(
      placeReviewCounts
        .filter((placeReviewCount) => highestTierFor(placeReviewCount.reviewCount) !== null)
        .map((placeReviewCount) => placeReviewCount.placeId)
    )

    const hasInvalidPlace = input.placeIds.some((placeId) => !earnedPlaceIds.has(placeId))
    if (hasInvalidPlace) {
      throw new InvalidProfileBadgeSelectionException()
    }

    const selected = await this.userProfileBadgesRepo.replaceForUser(input)
    return {
      placeIds: selected
        .sort((a, b) => a.position - b.position)
        .map((profileBadgeSelection) => profileBadgeSelection.placeId)
    }
  }
}
