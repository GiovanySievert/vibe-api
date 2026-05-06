import { PLACE_REVIEW_CREATED_RK } from '@src/config/rabbitmq.config'
import { EvaluateUserPlaceBadge } from '@src/modules/badges/application/use-cases'
import { PlaceReview } from '@src/modules/place-review/domain/mappers'
import { PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { RecordWeeklyActivity } from '@src/modules/streaks/application/use-cases'
import { RabbitMQProducer } from '@src/shared/infra/messaging'

export type CreatePlaceReviewData = Omit<PlaceReview, 'id' | 'createdAt' | 'updatedAt'>

export class CreatePlaceReview {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly producer: RabbitMQProducer,
    private readonly recordWeeklyActivity: RecordWeeklyActivity,
    private readonly evaluateUserPlaceBadge: EvaluateUserPlaceBadge
  ) {}

  async execute(data: CreatePlaceReviewData): Promise<PlaceReview> {
    const review = await this.placeReviewRepo.create(data)

    try {
      await this.producer.publish(
        {
          placeId: review.placeId,
          reviewId: review.id,
          createdAt: review.createdAt
        },
        PLACE_REVIEW_CREATED_RK
      )
    } catch (err) {
      console.error('failed to publish place.review.created', err)
    }

    try {
      await this.recordWeeklyActivity.execute(review.userId, review.createdAt)
    } catch (err) {
      console.error('failed to record weekly streak activity', err)
    }

    try {
      await this.evaluateUserPlaceBadge.execute({ userId: review.userId, placeId: review.placeId })
    } catch (err) {
      console.error('failed to evaluate place badge', err)
    }

    return review
  }
}
