import { PLACE_REVIEW_CREATED_RK } from '@src/config/rabbitmq.config'
import { EvaluateUserPlaceBadge } from '@src/modules/badges/application/use-cases'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { RecordWeeklyActivity } from '@src/modules/streaks/application/use-cases'
import { StreakUpdateResult } from '@src/modules/streaks/domain/types'
import { RabbitMQProducer } from '@src/shared/infra/messaging'
import { haversineMeters } from '@src/shared/utils/haversine'
import { appLogger } from '@src/config/logger'

import { PlaceReviewCooldownException, PlaceReviewOutOfRangeException } from '../../domain/exceptions'

export type CreatePlaceReviewData = Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt' | 'placeImageUrl'> & {
  placeImageUrl: string
  userLat: number
  userLng: number
  placeLat: number
  placeLng: number
}

export interface CreatePlaceReviewConfig {
  cooldownMinutes: number
  maxDistanceMeters: number
}

export type CreatePlaceReviewResult = PlaceReview & {
  streakUpdate: StreakUpdateResult | null
}

export class CreatePlaceReview {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly producer: RabbitMQProducer,
    private readonly recordWeeklyActivity: RecordWeeklyActivity,
    private readonly evaluateUserPlaceBadge: EvaluateUserPlaceBadge,
    private readonly config: CreatePlaceReviewConfig
  ) {}

  async execute(data: CreatePlaceReviewData): Promise<CreatePlaceReviewResult> {
    this.assertDistance(data)
    await this.assertCooldown(data.userId, data.placeId)

    const review = await this.placeReviewRepo.create(this.toPersistable(data))

    await this.publishCreated(review)
    const streakUpdate = await this.recordActivity(review)
    await this.evaluateBadge(review)

    return { ...review, streakUpdate }
  }

  private assertDistance(data: CreatePlaceReviewData): void {
    const distance = haversineMeters(
      { lat: data.userLat, lng: data.userLng },
      { lat: data.placeLat, lng: data.placeLng }
    )
    if (distance > this.config.maxDistanceMeters) {
      throw new PlaceReviewOutOfRangeException(Math.round(distance), this.config.maxDistanceMeters)
    }
  }

  private async assertCooldown(userId: string, placeId: string): Promise<void> {
    const lastReview = await this.placeReviewRepo.getLastReviewByUserAndPlace(userId, placeId)
    if (!lastReview) return

    const cooldownMs = this.config.cooldownMinutes * 60 * 1000
    const elapsed = Date.now() - lastReview.createdAt.getTime()
    if (elapsed >= cooldownMs) return

    const nextAllowedAt = new Date(lastReview.createdAt.getTime() + cooldownMs)
    throw new PlaceReviewCooldownException(nextAllowedAt, this.config.cooldownMinutes)
  }

  private toPersistable(data: CreatePlaceReviewData): Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'> {
    const { userLat: _userLat, userLng: _userLng, placeLat: _placeLat, placeLng: _placeLng, ...rest } = data
    void _userLat
    void _userLng
    void _placeLat
    void _placeLng
    return rest
  }

  private async publishCreated(review: PlaceReview): Promise<void> {
    try {
      await this.producer.publish(
        { placeId: review.placeId, reviewId: review.id, createdAt: review.createdAt },
        PLACE_REVIEW_CREATED_RK
      )
    } catch (err) {
      appLogger.error('failed to publish place.review.created', { error: err })
    }
  }

  private async recordActivity(review: PlaceReview): Promise<StreakUpdateResult | null> {
    try {
      return await this.recordWeeklyActivity.execute(review.userId, review.createdAt)
    } catch (err) {
      appLogger.error('failed to record weekly streak activity', { error: err })
      return null
    }
  }

  private async evaluateBadge(review: PlaceReview): Promise<void> {
    try {
      await this.evaluateUserPlaceBadge.execute({ userId: review.userId, placeId: review.placeId })
    } catch (err) {
      appLogger.error('failed to evaluate place badge', { error: err })
    }
  }
}
