import { appLogger } from '@src/config/logger'
import {
  PLACE_REVIEW_COMMENT_CREATED_EVENT,
  PlaceReviewCommentCreatedEvent
} from '@src/modules/place-review/application/events/place-review-comment-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { UserBlockRepository } from '@src/modules/blocks/domain/repositories'
import { placeReviewCommentTemplate } from '../templates/place-review-comment.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchPlaceReviewCommentHandler
  implements ApplicationEventHandler<PlaceReviewCommentCreatedEvent>
{
  constructor(
    private readonly dispatchNotification: DispatchNotification,
    private readonly userBlockRepository: UserBlockRepository
  ) {}

  async handle(event: PlaceReviewCommentCreatedEvent): Promise<void> {
    if (event.name !== PLACE_REVIEW_COMMENT_CREATED_EVENT) {
      return
    }

    const blocked = await this.userBlockRepository.isBlockedEitherWay(
      event.payload.reviewOwnerId,
      event.payload.commenterId
    )

    if (blocked) {
      return
    }

    const { userIds, payload } = placeReviewCommentTemplate(event)

    if (userIds.length === 0) {
      return
    }

    try {
      await this.dispatchNotification.execute({ userIds, payload })
    } catch (error) {
      appLogger.warn('Failed to dispatch place review comment notification', {
        error,
        reviewId: event.payload.reviewId,
        commenterId: event.payload.commenterId
      })
    }
  }
}
