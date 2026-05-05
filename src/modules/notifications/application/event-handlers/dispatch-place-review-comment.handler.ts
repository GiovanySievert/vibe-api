import { appLogger } from '@src/config/logger'
import {
  PLACE_REVIEW_COMMENT_CREATED_EVENT,
  PlaceReviewCommentCreatedEvent
} from '@src/modules/place-review/application/events/place-review-comment-created.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { placeReviewCommentTemplate } from '../templates/place-review-comment.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchPlaceReviewCommentHandler
  implements ApplicationEventHandler<PlaceReviewCommentCreatedEvent>
{
  constructor(private readonly dispatchNotification: DispatchNotification) {}

  async handle(event: PlaceReviewCommentCreatedEvent): Promise<void> {
    if (event.name !== PLACE_REVIEW_COMMENT_CREATED_EVENT) {
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
