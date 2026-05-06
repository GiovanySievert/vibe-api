import { BADGE_EARNED_RK } from '@src/config/rabbitmq.config'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { RabbitMQProducer } from '@src/shared/infra/messaging'

import { tiersAchievedFor } from '../constants/place-review-badge-tiers'
import { PlaceReviewBadgeTier } from '../../domain/types'
import { UserPlaceBadgesRepository } from '../../domain/repositories'

export interface EvaluateUserPlaceBadgeInput {
  userId: string
  placeId: string
}

export class EvaluateUserPlaceBadge {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly userPlaceBadgesRepo: UserPlaceBadgesRepository,
    private readonly producer: RabbitMQProducer
  ) {}

  async execute({ userId, placeId }: EvaluateUserPlaceBadgeInput): Promise<void> {
    const reviewCount = await this.placeReviewRepo.countReviewsByUserAndPlace(userId, placeId)
    const achieved = tiersAchievedFor(reviewCount)
    const existing = await this.userPlaceBadgesRepo.getByUserAndPlace(userId, placeId)
    const existingTiers = new Set<PlaceReviewBadgeTier>(existing.map((b) => b.tier))
    const achievedTierSet = new Set<PlaceReviewBadgeTier>(achieved.map((t) => t.tier))

    for (const cfg of achieved) {
      if (existingTiers.has(cfg.tier)) continue

      const inserted = await this.userPlaceBadgesRepo.upsertTier({ userId, placeId, tier: cfg.tier })

      try {
        await this.producer.publish(
          {
            userId,
            placeId,
            tier: cfg.tier,
            label: cfg.label,
            achievedAt: inserted.achievedAt
          },
          BADGE_EARNED_RK
        )
      } catch (err) {
        console.error('failed to publish badge.earned', err)
      }
    }

    const tiersToRemove = [...existingTiers].filter((t) => !achievedTierSet.has(t))
    if (tiersToRemove.length > 0) {
      await this.userPlaceBadgesRepo.removeTiers({ userId, placeId, tiers: tiersToRemove })
    }
  }
}
