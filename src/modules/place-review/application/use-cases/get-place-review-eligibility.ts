import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'

export interface GetPlaceReviewEligibilityInput {
  userId: string
  placeId: string
}

export interface PlaceReviewEligibility {
  canReview: boolean
  cooldown: {
    active: boolean
    lastReviewAt: string | null
    nextAllowedAt: string | null
    cooldownHours: number
  }
  reason: 'cooldown' | null
}

export interface GetPlaceReviewEligibilityConfig {
  cooldownHours: number
}

export class GetPlaceReviewEligibility {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly config: GetPlaceReviewEligibilityConfig
  ) {}

  async execute(input: GetPlaceReviewEligibilityInput): Promise<PlaceReviewEligibility> {
    const lastReview = await this.placeReviewRepo.getLastReviewByUserAndPlace(input.userId, input.placeId)

    const cooldownMs = this.config.cooldownHours * 60 * 60 * 1000
    let cooldownActive = false
    let nextAllowedAt: Date | null = null

    if (lastReview) {
      const elapsed = Date.now() - lastReview.createdAt.getTime()
      if (elapsed < cooldownMs) {
        cooldownActive = true
        nextAllowedAt = new Date(lastReview.createdAt.getTime() + cooldownMs)
      }
    }

    return {
      canReview: !cooldownActive,
      cooldown: {
        active: cooldownActive,
        lastReviewAt: lastReview ? lastReview.createdAt.toISOString() : null,
        nextAllowedAt: nextAllowedAt ? nextAllowedAt.toISOString() : null,
        cooldownHours: this.config.cooldownHours
      },
      reason: cooldownActive ? 'cooldown' : null
    }
  }
}
